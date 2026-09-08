import { isShortUrl } from './hosts';
import { isSplashHtml, parseSplashFields, splashPassUrl } from './splash';

const MAX = 10;
const HOP_RULE = 917299;

const jsRedirect = (html: string, base: string): string | null => {
  const target = html.match(/(?:document|window)\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/)?.[1];
  if (!target) return null;
  try {
    return new URL(target, base).href;
  } catch {
    return null;
  }
};

const learnMore = (html: string, base: string): string | null => {
  const href = html.match(/href=["']([^"']*learn_more\.php[^"']*)["']/i)?.[1];
  if (!href) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
};

const hasBtn7 = (html: string): boolean => /id=["']btn7["']/i.test(html);

const armReferer = async (host: string, referer: string): Promise<void> => {
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [HOP_RULE],
    addRules: [
      {
        id: HOP_RULE,
        priority: 100,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [{ header: 'Referer', operation: 'set', value: referer }],
        },
        condition: {
          requestDomains: [host],
          resourceTypes: ['xmlhttprequest'],
          tabIds: [chrome.tabs.TAB_ID_NONE],
        },
      },
    ],
  });
};

const clearReferer = (): Promise<void> =>
  chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [HOP_RULE] }).catch(() => {});

const fetchHop = async (url: string, referer: string): Promise<Response> => {
  await armReferer(new URL(url).hostname, referer);
  return fetch(url, {
    redirect: 'follow',
    credentials: 'include',
    cache: 'no-store',
    headers: { Accept: 'text/html' },
  });
};

export const fetchHtml = async (url: string, referer: string): Promise<{ url: string; html: string }> => {
  try {
    const res = await fetchHop(url, referer);
    const html = await res.text();
    if (!res.ok || !html) throw new Error('empty');
    return { url: res.url || url, html };
  } finally {
    await clearReferer();
  }
};

const passSplash = async (
  pageUrl: string,
  html: string,
  referer: string,
): Promise<{ url: string; html: string }> => {
  const fields = parseSplashFields(html);
  if (!fields) throw new Error('splash');
  const pass = splashPassUrl(pageUrl, fields);
  try {
    const res = await fetchHop(pass, referer || pageUrl);
    const body = await res.text();
    if (!res.ok || !body || isSplashHtml(body)) throw new Error('splash');
    return { url: res.url || pass, html: body };
  } finally {
    await clearReferer();
  }
};

const fetchPage = async (url: string, referer: string): Promise<{ url: string; html: string }> => {
  let page = await fetchHtml(url, referer);
  if (isSplashHtml(page.html)) page = await passSplash(page.url, page.html, referer);

  const land = jsRedirect(page.html, page.url);
  if (land && land !== page.url && !isShortUrl(land) && !learnMore(page.html, page.url) && !hasBtn7(page.html)) {
    page = await fetchHtml(land, page.url);
    if (isSplashHtml(page.html)) page = await passSplash(page.url, page.html, page.url);
  }
  return page;
};

export const fetchLastMediatorReferer = async (shortUrl: string, assigned: string): Promise<string> => {
  let url = assigned;
  let referer = shortUrl;

  for (let i = 0; i < MAX; i++) {
    const page = await fetchPage(url, referer);

    const lm = learnMore(page.html, page.url);
    if (lm) {
      const hop = await fetchPage(lm, page.url);
      const next = jsRedirect(hop.html, hop.url);
      if (!next || isShortUrl(next) || next === page.url || new URL(next).pathname === '/') {
        throw new Error('learn_more');
      }
      referer = hop.url;
      url = next;
      continue;
    }

    if (hasBtn7(page.html)) return `${new URL(page.url).origin}/`;

    const next = jsRedirect(page.html, page.url);
    if (!next || next === page.url || isShortUrl(next)) throw new Error('hop');
    referer = page.url;
    url = next;
  }

  throw new Error('hop');
};
