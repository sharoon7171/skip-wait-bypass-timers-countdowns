import { hostMatchesSite } from '../../hosts/check';

export const SITE = 'arolinks' as const;

export const MSG_HOP = 'AROLINKS_HOP' as const;
export const MSG_UNLOCK = 'AROLINKS_UNLOCK' as const;
export const MSG_PROGRESS = 'AROLINKS_PROGRESS' as const;

export const AROLINKS_UNLOCK_READY_MS = 25_000;
export const AROLINKS_DEST_WAIT_MS = 60_000;

export const ALIAS_DNR = '(key-[A-Za-z0-9]+|[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]*)';

export type ArolinksProgress = { lead: string; detail: string; status: string };

const ALIAS_RE = /^(?=.*[A-Za-z])[A-Za-z0-9]{3,}$/;
const KEY_RE = /^key-[A-Za-z0-9]+$/;
const HOSTS = ['arolinks.com', 'vplink.in'] as const;

export const isWorkingPage = (): boolean =>
  location.href.startsWith(chrome.runtime.getURL('working.html'));

const aliasFromPath = (pathname: string): string | null => {
  const [seg, ...rest] = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (!seg || rest.length > 0 || !(KEY_RE.test(seg) || ALIAS_RE.test(seg))) return null;
  return seg;
};

export const isShortUrl = (href: string): boolean => {
  try {
    const u = new URL(href);
    if (!/^https?:\/\//i.test(u.href)) return false;
    const h = u.hostname.toLowerCase();
    if (!HOSTS.some((d) => h === d || h.endsWith(`.${d}`))) return false;
    return !!aliasFromPath(u.pathname);
  } catch {
    return false;
  }
};

export const isTimedDestUrl = async (href: string): Promise<boolean> => {
  try {
    return hostMatchesSite(new URL(href).hostname, 'arolinks-wait');
  } catch {
    return false;
  }
};
