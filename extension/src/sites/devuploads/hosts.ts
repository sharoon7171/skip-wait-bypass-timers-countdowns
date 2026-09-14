export const SITE = 'devuploads' as const;
export const MSG_DEVUPLOADS_HOLD = 'DEVUPLOADS_HOLD' as const;
export const MSG_DEVUPLOADS_RELEASE = 'DEVUPLOADS_RELEASE' as const;

const FILE_ID_RE = /^[A-Za-z0-9]{8,}$/;

const isHostname = (hostname: string): boolean => {
  const h = hostname.toLowerCase();
  return h === 'devuploads.com' || h.endsWith('.devuploads.com');
};

const fileIdFromPath = (pathname: string): string | null => {
  const id = pathname.replace(/^\/+|\/+$/g, '');
  return id && !id.includes('/') && FILE_ID_RE.test(id) ? id : null;
};

export const isDevuploadsFileUrlSync = (href: string): boolean => {
  try {
    const u = new URL(href);
    return isHostname(u.hostname) && fileIdFromPath(u.pathname) !== null;
  } catch {
    return false;
  }
};

export const fileIdFromHref = (href: string): string | null => {
  try {
    return fileIdFromPath(new URL(href).pathname);
  } catch {
    return null;
  }
};
