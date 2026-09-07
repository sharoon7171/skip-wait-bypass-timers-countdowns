import { recordBypassSuccess } from '../../free-bypass';
import { canBypass } from '../../gate';
import { createFullPageOverlay, type FullPageOverlay } from '../../injected-ui/full-page-overlay';
import { buildFullPageOverlayCss, overlayActiveClass } from '../../injected-ui/overlay-styles';
import { whenDomParsed } from '../../utils/domain-check';

const SITE = 'movies4u' as const;
const OVERLAY_ID = 'skip-wait-movies4u-overlay';
const BOOT_STYLE_ID = 'skip-wait-movies4u-boot';

const NOTE = {
  working: {
    lead: 'Opening Latest Releases',
    detail: 'Skip Wait is reading the landing source.',
  },
  failed: {
    lead: 'Could not open Latest Releases',
    detail: 'Reload and try again.',
  },
} as const;

let ui: FullPageOverlay | null = null;
let pulse: number | null = null;

const latestReleasesFromHtml = (html: string, pageHost: string): string | null => {
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\bcta-btn\b/i.test(tag) || !/\bbtn-1\b/i.test(tag)) continue;
    const raw = tag.match(/\bhref\s*=\s*["'](https?:\/\/[^"'>\s]+)["']/i)?.[1]?.trim();
    if (!raw) continue;
    try {
      const url = new URL(raw);
      if (url.hostname !== pageHost) return url.href;
    } catch {
      continue;
    }
  }
  return null;
};

const resolveLatestReleases = async (): Promise<string | null> => {
  const host = location.hostname;
  const res = await fetch(`${location.origin}/`, {
    cache: 'no-store',
    credentials: 'same-origin',
  }).catch(() => null);
  if (res?.ok) {
    const href = latestReleasesFromHtml(await res.text(), host);
    if (href) return href;
  }
  return latestReleasesFromHtml(document.documentElement.innerHTML, host);
};

const boot = (): void => {
  const active = overlayActiveClass(OVERLAY_ID);
  document.documentElement.classList.add(active);
  if (document.getElementById(BOOT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = BOOT_STYLE_ID;
  style.textContent = buildFullPageOverlayCss(OVERLAY_ID, active);
  (document.head ?? document.documentElement).appendChild(style);
};

const mount = (status: string): FullPageOverlay => {
  boot();
  if (ui) {
    ui.setNote(NOTE.working);
    ui.setStatus(status);
    ui.setError(null);
    return ui;
  }
  ui = createFullPageOverlay({
    id: OVERLAY_ID,
    brand: 'Skip Wait',
    note: NOTE.working,
    status,
  });
  return ui;
};

const startPulse = (overlay: FullPageOverlay): void => {
  let dots = 0;
  const paint = (): void => {
    overlay.setNote({
      lead: `${NOTE.working.lead}${'.'.repeat(dots + 1)}`,
      detail: NOTE.working.detail,
    });
  };
  paint();
  if (pulse != null) return;
  pulse = window.setInterval(() => {
    dots = (dots + 1) % 3;
    paint();
  }, 450);
};

const stopPulse = (): void => {
  if (pulse == null) return;
  clearInterval(pulse);
  pulse = null;
};

const run = async (): Promise<void> => {
  const overlay = mount('Reading landing source');
  startPulse(overlay);
  const href = await resolveLatestReleases();
  stopPulse();
  if (!href) {
    overlay.setNote(NOTE.failed);
    overlay.setStatus('');
    overlay.setError('Latest Releases link missing from landing source.');
    return;
  }
  overlay.setNote(NOTE.working);
  overlay.setStatus('Opening Latest Releases');
  recordBypassSuccess();
  location.replace(href);
};

export const initMovies4uLandingRedirect = (): void => {
  if (window !== window.top) return;
  void canBypass(SITE).then((ok) => {
    if (!ok) return;
    whenDomParsed(() => {
      boot();
      void run();
    });
  });
};
