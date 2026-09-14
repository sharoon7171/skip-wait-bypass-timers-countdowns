import { canBypassHost } from '../../gate';
import { SITE } from './hosts';

const MSG = 'DEVUPLOADS_DOWNLOAD2' as const;
const CDN_RE = /https?:\/\/du\d+\.devuploads\.com\/d\/[A-Za-z0-9._~/-]+/i;

type Req = { type: typeof MSG; id: string };
type Res = { url: string | null };

const pickCdn = (html: string): string | null => {
  const ori = html.match(
    /<input[^>]*name=["']orilink["'][^>]*value=["']([^"']+)["'][^>]*>/i,
  )?.[1];
  if (ori && CDN_RE.test(ori)) return ori;
  const flipped = html.match(
    /<input[^>]*value=["'](https?:\/\/du\d+\.devuploads\.com\/d\/[^"']+)["'][^>]*name=["']orilink["']/i,
  )?.[1];
  if (flipped && CDN_RE.test(flipped)) return flipped;
  return html.match(CDN_RE)?.[0] ?? null;
};

const mintCdn = async (id: string): Promise<string | null> => {
  const page = `https://devuploads.com/${id}`;
  const res = await fetch(page, {
    method: 'POST',
    credentials: 'omit',
    cache: 'no-store',
    headers: {
      Accept: 'text/html,*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Referer: page,
    },
    body: new URLSearchParams({
      op: 'download2',
      id,
      rand: '',
      referer: '',
      xd: '1',
      tsty: '0',
      ransite: '3',
      dnumber: '0',
      adblock_detected: '0',
      ipp: '',
    }),
  });
  if (!res.ok) return null;
  return pickCdn(await res.text());
};

export const initDevuploadsResolve = (): void => {
  chrome.runtime.onMessage.addListener((msg: Partial<Req>, sender, reply) => {
    if (msg.type !== MSG) return false;
    const id = typeof msg.id === 'string' ? msg.id.trim() : '';
    if (!id) {
      reply({ url: null } satisfies Res);
      return false;
    }
    void (async () => {
      try {
        const host = sender.tab?.url ? new URL(sender.tab.url).hostname : '';
        if (!host || !(await canBypassHost(host, SITE))) {
          reply({ url: null } satisfies Res);
          return;
        }
        reply({ url: await mintCdn(id) } satisfies Res);
      } catch {
        reply({ url: null } satisfies Res);
      }
    })();
    return true;
  });
};

export const requestCdn = (id: string): Promise<string> =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: MSG, id } satisfies Req, (res?: Res) => {
      if (chrome.runtime.lastError || !res?.url) reject(new Error('cdn'));
      else resolve(res.url);
    });
  });
