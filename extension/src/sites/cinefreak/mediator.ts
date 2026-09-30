import { recordBypassSuccess } from '../../free-bypass';
import { canBypass } from '../../gate';
import { createFullPageOverlay, type FullPageOverlay } from '../../injected-ui/full-page-overlay';
import { buildFullPageOverlayCss, overlayActiveClass } from '../../injected-ui/overlay-styles';
import { whenDomParsed } from '../../utils/domain-check';
import { CINEFREAK_MEDIATOR_PATH } from './hosts';

const OVERLAY_ID = 'skip-wait-cinefreak-mediator';
const BOOT_STYLE_ID = 'skip-wait-cinefreak-mediator-boot';
const REDIRECT_RE = /window\.location\.href\s*=\s*"([^"]+)"/;
const OVERLAY_MIN_MS = 200;
const NOTE = {
  lead: 'Hang tight — opening your download.',
  detail: "You don't need to tap anything on the page.",
} as const;

let ui: FullPageOverlay | null = null;
let overlayAt = 0;
let started = false;

const bootOverlayLock = (): void => {
  const active = overlayActiveClass(OVERLAY_ID);
  document.documentElement.classList.add(active);
  if (document.getElementById(BOOT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = BOOT_STYLE_ID;
  style.textContent = buildFullPageOverlayCss(OVERLAY_ID, active);
  (document.head || document.documentElement).appendChild(style);
};

const mountUi = (status: string): FullPageOverlay => {
  bootOverlayLock();
  if (ui) {
    ui.setStatus(status);
    ui.setError(null);
    return ui;
  }
  overlayAt = Date.now();
  ui = createFullPageOverlay({
    id: OVERLAY_ID,
    brand: 'Skip Wait',
    note: NOTE,
    status,
  });
  return ui;
};

function unescapeJsString(raw: string): string {
  return raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\\//g, '/');
}

function destinationFromHtml(html: string): string | null {
  const raw = html.match(REDIRECT_RE)?.[1];
  if (!raw) return null;
  try {
    const href = new URL(unescapeJsString(raw), location.href).href;
    if (href === location.href) return null;
    return href;
  } catch {
    return null;
  }
}

function redirect(dest: string): void {
  mountUi('Opening your download…');
  recordBypassSuccess();
  const go = (): void => location.replace(dest);
  const wait = Math.max(0, OVERLAY_MIN_MS - (Date.now() - overlayAt));
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (wait > 0) window.setTimeout(go, wait);
      else go();
    });
  });
}

function jump(): void {
  if (started || !CINEFREAK_MEDIATOR_PATH.test(location.pathname)) return;
  const dest = destinationFromHtml(document.documentElement.innerHTML);
  if (!dest) return;
  started = true;
  redirect(dest);
}

export function initCinefreakMediator(): void {
  if (window !== window.top) return;
  void canBypass('cinefreak').then((ok) => {
    if (!ok) return;
    if (CINEFREAK_MEDIATOR_PATH.test(location.pathname)) mountUi('Getting your download ready…');
    jump();
    whenDomParsed(jump);
    const mo = new MutationObserver(() => {
      jump();
      if (started) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  });
}
