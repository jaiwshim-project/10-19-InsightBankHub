/* /api/feeds — 6개 채널 RSS 통합 (Vercel Serverless · Node 18+)
 * - 5개 채널: 실제 RSS 가져오기
 * - 1개 채널 (ARG): RSS 미제공, 빈 목록 반환
 * - 1시간 CDN 캐시 + stale-while-revalidate 10분
 * - CORS 허용 (정적 사이트에서 fetch 가능)
 */

const CHANNELS = [
  { id: 'biotimes',     name: '바이오타임즈',       domain: 'biotimes.co.kr',        url: 'https://www.biotimes.co.kr/rss/allArticle.xml' },
  { id: 'kmna',         name: '한국M&A경제신문',    domain: 'kmnanews.com',          url: 'https://www.kmnanews.com/rss/allArticle.xml' },
  { id: 'startuptoday', name: '스타트업투데이',      domain: 'startuptoday.kr',       url: 'https://www.startuptoday.kr/rss/allArticle.xml' },
  { id: 'localtax',     name: '월간지방세연구',      domain: 'localtaxresearch.com',  url: 'https://www.localtaxresearch.com/rss/allArticle.xml' },
  { id: 'arg',          name: '애틀러스리서치',      domain: 'arg.co.kr',             url: null },
  { id: 'defensetoday', name: '디펜스투데이',        domain: 'defensetoday.kr',       url: 'https://www.defensetoday.kr/rss/allArticle.xml' },
];

function decodeEntities(s) {
  return String(s)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripCdataAndTags(s) {
  return decodeEntities(
    String(s)
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function parseRssXml(xml, channel) {
  const items = [];
  const re = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const get = (tag) => {
      const r = block.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
      return r ? r[1] : '';
    };
    const title = stripCdataAndTags(get('title'));
    const link = stripCdataAndTags(get('link'));
    const pubDate = stripCdataAndTags(get('pubDate') || get('dc:date'));
    const description = stripCdataAndTags(get('description')).slice(0, 220);
    const author = stripCdataAndTags(get('author') || get('dc:creator'));
    const category = stripCdataAndTags(get('category'));
    if (!title) continue;
    items.push({
      title: title.slice(0, 200),
      link,
      pubDate,
      pubDateMs: pubDate ? Date.parse(pubDate) : 0,
      description,
      author,
      category,
      channelId: channel.id,
      channelName: channel.name,
    });
  }
  return items;
}

async function fetchChannel(channel) {
  if (!channel.url) {
    return { ...channel, items: [], note: 'RSS 미제공 (리서치 매체)' };
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    const r = await fetch(channel.url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InsightBankHub-Aggregator/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const xml = await r.text();
    const items = parseRssXml(xml, channel);
    return { ...channel, items };
  } catch (err) {
    return { ...channel, items: [], error: String(err.message || err) };
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method not allowed' });

  try {
    const channels = await Promise.all(CHANNELS.map(fetchChannel));

    const all = channels.flatMap((c) => c.items);
    all.sort((a, b) => (b.pubDateMs || 0) - (a.pubDateMs || 0));

    res.status(200).json({
      ok: true,
      generatedAt: new Date().toISOString(),
      channels: channels.map(({ items, ...rest }) => ({
        ...rest,
        count: items.length,
        latestAt: items[0]?.pubDate || null,
      })),
      items: all.slice(0, 120),
      total: all.length,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
