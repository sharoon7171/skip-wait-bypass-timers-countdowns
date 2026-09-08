export const pleaseWaitTarget = (html: string, base: string): string | null => {
  const target = html.match(/(?:document|window)\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/)?.[1];
  if (!target) return null;
  try {
    const next = new URL(target, base);
    return next.origin === new URL(base).origin ? null : next.href;
  } catch {
    return null;
  }
};

export const isVpnHtml = (html: string): boolean =>
  /vpn detected|disable vpn|using a vpn or proxy|turn off\/?\s*disable vpn/i.test(html);

export const isPleaseWaitHtml = (html: string): boolean =>
  (/Opening Link/i.test(html) || /<h1[^>]*>\s*Please Wait/i.test(html)) &&
  (!!html.match(/(?:document|window)\.location/) || /hittracks|entiredust|insurancess|studiiss/i.test(html));

const offsiteHttp = (href: string | null | undefined, base: string): string | null => {
  const v = (href || '').trim();
  if (!/^https?:\/\//i.test(v)) return null;
  try {
    const next = new URL(v, base);
    return next.origin === new URL(base).origin ? null : next.href;
  } catch {
    return null;
  }
};

const DEST_IDS = ['gt-link', 'link1s', 'get-link'] as const;

export const unlockDestinationFromHtml = (html: string, base: string): string | null => {
  for (const id of DEST_IDS) {
    const href =
      offsiteHttp(html.match(new RegExp(`id=["']${id}["'][^>]*href=["'](https?:[^"']+)["']`, 'i'))?.[1], base) ??
      offsiteHttp(html.match(new RegExp(`href=["'](https?:[^"']+)["'][^>]*id=["']${id}["']`, 'i'))?.[1], base);
    if (href) return href;
  }
  return null;
};
