const CHECK_CLICK = '/check-click';
const GET_LINK = '/get-link-download';

const ENCRYPTED_RE = /^\/link-encrypted\/(.+)$/i;
const FULL_PAGES_RE = /^\/api\/v1\/full-pages\/?$/i;
const L_RE = /^\/l\/([^/]+)\/?$/i;
const LL_RE = /^\/ll\/([^/]+)\/?$/i;
const GET_LINK_CALL_RE =
  /getLink\s*\(\s*["'][^"']+["']\s*,\s*["']([^"']+)["']\s*,\s*["'](encrypted_link|short_link)["']\s*,\s*["']([^"']+)["']\s*\)/i;

export type OneShortlinkJob =
  | { kind: 'short_link'; id: string }
  | { kind: 'encrypted_link'; id: string };

type GetLinkOk = {
  status: string;
  redirect_url?: string;
  shortener_id?: number | string;
};

type GetLinkCall = {
  job: OneShortlinkJob;
  token: string;
};

const decodePathId = (raw: string): string => {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const postForm = (path: string, body: URLSearchParams): Promise<Response> =>
  fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body,
  });

export const isFullPagesPath = (pathname = location.pathname): boolean => FULL_PAGES_RE.test(pathname);

export function oneShortlinkJob(pathname = location.pathname): OneShortlinkJob | null {
  const enc = pathname.match(ENCRYPTED_RE)?.[1];
  if (enc) return { kind: 'encrypted_link', id: decodePathId(enc) };
  const l = pathname.match(L_RE)?.[1];
  if (l) return { kind: 'short_link', id: decodePathId(l) };
  const ll = pathname.match(LL_RE)?.[1];
  if (ll) return { kind: 'short_link', id: decodePathId(ll) };
  return null;
}

const getLinkCall = (doc: Document = document): GetLinkCall | null => {
  const m = (doc.documentElement?.innerHTML ?? '').match(GET_LINK_CALL_RE);
  if (!m?.[1] || !m[2] || !m[3]) return null;
  return { job: { kind: m[2] as OneShortlinkJob['kind'], id: m[1] }, token: m[3] };
};

export function unlockFromPage(doc: Document = document): { job: OneShortlinkJob; token?: string } | null {
  const call = getLinkCall(doc);
  if (call) return call;
  const job = oneShortlinkJob();
  return job ? { job } : null;
}

export function csrfFromPage(doc: Document = document): string | null {
  const fromCall = getLinkCall(doc)?.token.trim();
  if (fromCall) return fromCall;
  const fromLivewire = doc.querySelector('script[data-csrf]')?.getAttribute('data-csrf')?.trim();
  if (fromLivewire) return fromLivewire;
  const fromMeta = doc.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content?.trim();
  if (fromMeta) return fromMeta;
  return doc.querySelector<HTMLInputElement>('input[name="_token"]')?.value?.trim() || null;
}

export function passwordRequired(doc: Document = document): boolean {
  const el = doc.getElementById('password-area');
  if (!el || el.hasAttribute('hidden') || el.classList.contains('hidden')) return false;
  if (el.checkVisibility?.() === false) return false;
  const st = getComputedStyle(el);
  return st.display !== 'none' && st.visibility !== 'hidden';
}

export async function postGetLinkDownload(
  job: OneShortlinkJob,
  token: string,
): Promise<{ redirectUrl: string; shortenerId?: string }> {
  const r = await postForm(
    GET_LINK,
    new URLSearchParams({ url: job.id, type: job.kind, _token: token }),
  );
  if (!r.ok) throw new Error(`get-link-download ${r.status}`);
  const j = (await r.json()) as GetLinkOk;
  const redirectUrl = j.redirect_url?.trim();
  if (j.status !== 'success' || !redirectUrl || !/^https?:\/\//i.test(redirectUrl)) {
    throw new Error('get-link-download empty');
  }
  const shortenerId = j.shortener_id != null ? String(j.shortener_id).trim() : '';
  return shortenerId ? { redirectUrl, shortenerId } : { redirectUrl };
}

export async function postCheckClick(shortenerId: string, token: string): Promise<void> {
  const r = await postForm(
    CHECK_CLICK,
    new URLSearchParams({ shortener_id: shortenerId, _token: token }),
  );
  if (!r.ok) throw new Error(`check-click ${r.status}`);
}

export async function resolveFullPagesRedirect(): Promise<string | null> {
  if (!isFullPagesPath() || unlockFromPage()) return null;
  const r = await fetch(location.href, {
    method: 'GET',
    credentials: 'same-origin',
    redirect: 'manual',
    cache: 'no-store',
    headers: { Accept: 'text/html' },
  });
  const loc = r.headers.get('Location')?.trim();
  if (loc) return new URL(loc, location.href).href;
  if (r.status < 200 || r.status >= 300) return null;
  const text = await r.text();
  const meta =
    text.match(/http-equiv=["']refresh["'][^>]*content=["'][^"']*url=['"]([^'"]+)['"]/i) ??
    text.match(/content=["'][^"']*url=['"]([^'"]+)['"][^>]*http-equiv=["']refresh["']/i);
  return meta?.[1] ? new URL(meta[1], location.href).href : null;
}
