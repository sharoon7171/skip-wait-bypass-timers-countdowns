import { hostMatchesSite } from '../../hosts/check';

export const SITE = 'linksflys' as const;
export const BRAND = 'LinksFlys' as const;

export const MSG_RESOLVE = 'LINKSFYLS_RESOLVE' as const;
export const MSG_PROGRESS = 'LINKSFYLS_PROGRESS' as const;
export const MSG_OPEN = 'LINKSFYLS_OPEN_DEST' as const;

export type LinksflysProgress = {
  lead: string;
  detail: string;
  status: string;
  waitEndTs?: number;
};

const ALIAS_RE = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/;

export const isHttpUrl = (href: string): boolean => /^https?:\/\//i.test(href);

export const aliasFromPath = (pathname: string): string | null => {
  const [seg, ...rest] = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  return seg && rest.length === 0 && ALIAS_RE.test(seg) ? seg : null;
};

export const entryUrl = (href: string): string | null => {
  try {
    const u = new URL(href);
    const alias = aliasFromPath(u.pathname);
    if (!alias) return null;
    return `${u.origin}/${encodeURIComponent(alias)}`;
  } catch {
    return null;
  }
};

export const aliasKey = (href: string): string | null => {
  try {
    const u = new URL(href);
    const alias = aliasFromPath(u.pathname);
    if (!alias) return null;
    return `${u.origin}/${alias}`;
  } catch {
    return null;
  }
};

export const isAliasUrl = async (href: string): Promise<boolean> => {
  try {
    const u = new URL(href);
    if (!isHttpUrl(u.href) || !(await hostMatchesSite(u.hostname, SITE))) return false;
    return aliasFromPath(u.pathname) != null;
  } catch {
    return false;
  }
};

export const isSiteHost = async (href: string): Promise<boolean> => {
  try {
    return isHttpUrl(href) && (await hostMatchesSite(new URL(href).hostname, SITE));
  } catch {
    return false;
  }
};
