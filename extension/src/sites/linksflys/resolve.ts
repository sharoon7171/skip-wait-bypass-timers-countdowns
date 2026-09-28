import { aliasKey, entryUrl, isHttpUrl, isSiteHost, type LinksflysProgress } from './hosts';

const REFERER_RULE = 918721;
const MAX_HOPS = 12;
const ACCEPT = 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8';
const FIELD_NAMES = ['_method', '_csrfToken', 'ad_form_data', '_Token[fields]', '_Token[unlocked]'] as const;

type OnProgress = ((p: LinksflysProgress) => void) | undefined;
type GoForm = { action: string; fields: Record<string, string> };

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const say = (onProgress: OnProgress, p: LinksflysProgress): void => {
  onProgress?.(p);
};

let refererGate: Promise<void> = Promise.resolve();

const withReferer = <T>(url: string, referer: string, run: () => Promise<T>): Promise<T> => {
  const job = refererGate.then(async () => {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [REFERER_RULE],
      addRules: [
        {
          id: REFERER_RULE,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [{ header: 'Referer', operation: 'set', value: referer }],
          },
          condition: {
            urlFilter: `|${url}`,
            resourceTypes: ['xmlhttprequest'],
            tabIds: [chrome.tabs.TAB_ID_NONE],
          },
        },
      ],
    });
    try {
      return await run();
    } finally {
      await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [REFERER_RULE] }).catch(() => {});
    }
  });
  refererGate = job.then(
    () => undefined,
    () => undefined,
  );
  return job;
};

const field = (html: string, name: string): string | null => {
  const esc = name.replace(/[[\]]/g, '\\$&');
  const m = html.match(
    new RegExp(`name="${esc}"[^>]*value="([^"]*)"|value="([^"]*)"[^>]*name="${esc}"`, 'i'),
  );
  return m?.[1] ?? m?.[2] ?? null;
};

const hasGoForm = (html: string): boolean =>
  !!field(html, 'ad_form_data') && !!field(html, '_csrfToken') && /id=["']go-link["']/i.test(html);

const counterSecFromGoPage = (html: string): number => {
  const m = html.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
  if (m?.[1] == null) throw new Error('counter_missing');
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 0) throw new Error('counter_invalid');
  return n;
};

const goFormFromHtml = (html: string, base: string): GoForm => {
  const actionRaw = html.match(/\bid=["']go-link["'][^>]*\baction=["']([^"']+)["']/i)?.[1];
  if (!actionRaw) throw new Error('form_action');
  const action = isHttpUrl(actionRaw) ? actionRaw : new URL(actionRaw, base).href;
  const fields: Record<string, string> = {};
  for (const name of FIELD_NAMES) {
    const v = field(html, name);
    if (v != null) fields[name] = v;
  }
  if (!fields['ad_form_data'] || !fields['_csrfToken']) throw new Error('form_parse');
  return { action, fields };
};

const fetchHtml = async (url: string): Promise<{ status: number; url: string; html: string }> => {
  const res = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
    redirect: 'follow',
    headers: { Accept: ACCEPT },
  });
  return { status: res.status, url: res.url || url, html: await res.text() };
};

const seed = async (entry: string): Promise<{ mediatorReferer: string; html?: string }> => {
  const res = await fetchHtml(entry);
  if (res.status < 200 || res.status >= 400) throw new Error(`seed_http_${res.status}`);
  if (hasGoForm(res.html)) return { mediatorReferer: entry, html: res.html };
  if (await isSiteHost(res.url)) throw new Error('seed_no_mediator');
  if (!isHttpUrl(res.url)) throw new Error('mediator_url');
  return { mediatorReferer: `${new URL(res.url).origin}/` };
};

const unlockHtml = (entry: string, mediatorReferer: string): Promise<string> =>
  withReferer(entry, mediatorReferer, async () => {
    const res = await fetchHtml(entry);
    if (res.status < 200 || res.status >= 400) throw new Error(`unlock_http_${res.status}`);
    if (!hasGoForm(res.html)) throw new Error('form_missing');
    return res.html;
  });

const postGo = (entry: string, html: string): Promise<string> => {
  const form = goFormFromHtml(html, entry);
  return withReferer(form.action, entry, async () => {
    const res = await fetch(form.action, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: new URL(entry).origin,
      },
      body: new URLSearchParams(form.fields),
    });
    if (!res.ok) throw new Error(`go_http_${res.status}`);
    let data: { url?: string };
    try {
      data = JSON.parse(await res.text()) as { url?: string };
    } catch {
      throw new Error('go_json');
    }
    const dest = typeof data.url === 'string' ? data.url.trim() : '';
    if (!dest || !isHttpUrl(dest)) throw new Error('go_fail');
    return dest;
  });
};

const resolveAlias = async (entry: string, again: boolean, onProgress: OnProgress): Promise<string> => {
  say(onProgress, {
    lead: again ? 'Hang tight — unlocking your next link.' : 'Hang tight — unlocking your link.',
    detail: again
      ? 'Skip Wait found another LinksFlys short link. You don’t need to tap anything.'
      : 'Skip Wait is preparing Get Link. You don’t need to tap anything.',
    status: again ? 'Preparing Get Link again' : 'Preparing Get Link',
  });
  const gate = await seed(entry);

  say(onProgress, {
    lead: again ? 'Hang tight — unlocking your next link.' : 'Hang tight — unlocking your link.',
    detail: 'Skip Wait is unlocking Get Link in the background.',
    status: 'Loading Get Link',
  });
  const html = gate.html ?? (await unlockHtml(entry, gate.mediatorReferer));

  const waitSec = counterSecFromGoPage(html);
  if (waitSec > 0) {
    say(onProgress, {
      lead: 'Your link is almost ready.',
      detail: 'Skip Wait is waiting for the Get Link timer from this page.',
      status: 'Waiting for Get Link',
      waitEndTs: Date.now() + waitSec * 1000,
    });
    await sleep(waitSec * 1000);
  }

  say(onProgress, {
    lead: 'Almost there.',
    detail: 'Skip Wait is getting your link now.',
    status: 'Getting link',
  });
  return postGo(entry, html);
};

export const resolveDestination = async (
  pageUrl: string,
  onProgress?: (p: LinksflysProgress) => void,
): Promise<string> => {
  const start = entryUrl(pageUrl);
  if (!start) throw new Error('alias');

  const seen = new Set<string>();
  let url = start;

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const key = aliasKey(url);
    if (!key) throw new Error('alias');
    if (seen.has(key)) throw new Error('go_cycle');
    seen.add(key);

    const next = await resolveAlias(url, hop > 0, onProgress);
    const nextKey = aliasKey(next);

    if (nextKey && seen.has(nextKey)) throw new Error('go_same');
    if (!(await isSiteHost(next)) || !nextKey) {
      say(onProgress, {
        lead: 'Almost there.',
        detail: 'Opening your destination now.',
        status: 'Opening your destination',
      });
      return next;
    }

    const nextEntry = entryUrl(next);
    if (!nextEntry) throw new Error('alias');
    url = nextEntry;
  }
  throw new Error('hops');
};
