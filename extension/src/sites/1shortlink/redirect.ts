import { recordBypassSuccess } from '../../free-bypass';
import { canBypass } from '../../gate';
import { createFullPageOverlay, type FullPageOverlay } from '../../injected-ui/full-page-overlay';
import { buildFullPageOverlayCss, overlayActiveClass } from '../../injected-ui/overlay-styles';
import { whenDomParsed } from '../../utils/domain-check';
import {
  csrfFromPage,
  isFullPagesPath,
  oneShortlinkJob,
  passwordRequired,
  postCheckClick,
  postGetLinkDownload,
  resolveFullPagesRedirect,
  unlockFromPage,
  type OneShortlinkJob,
} from './unlock';

const OVERLAY_ID = 'skip-wait-1shortlink-overlay';
const BOOT_STYLE_ID = 'skip-wait-1shortlink-boot';
const PULSE_MS = 450;
const LEAD = 'Skipping the waiting page.';

type Stage = {
  lead?: string;
  detail: string;
  status: string;
  pulse?: boolean;
};

const STAGE = {
  ready: {
    detail: 'Skip Wait clears the continue gate so you are not hunting buttons under ads.',
    status: 'Getting things ready',
  },
  openGate: {
    detail: 'Moving from the confirm page to unlock.',
    status: 'Opening the continue page',
  },
  prepare: {
    detail: 'No need to tap Continue or watch the please-wait strip.',
    status: 'Preparing unlock',
  },
  unlock: {
    detail: 'Advancing the continue flow this shortener already expects.',
    status: 'Unlocking your link',
  },
  continue: {
    detail: 'Finishing Continue for you — nothing to dig out of the ads.',
    status: 'Confirming continue',
  },
  open: {
    detail: 'Opening the destination attached to this share.',
    status: 'Opening your link',
  },
  password: {
    lead: 'This link needs a password.',
    detail: 'Unlock it on the page, then reload so Skip Wait can continue.',
    status: 'Password required',
    pulse: false,
  },
  failed: {
    lead: 'Unlock did not finish.',
    detail: 'Skip Wait could not clear this waiting page.',
    status: 'Something went wrong',
    pulse: false,
  },
} as const satisfies Record<string, Stage>;

let ui: FullPageOverlay | null = null;
let started = false;
let pulseTimer: number | null = null;
let pulseDots = 0;
let statusBase = '';

const isGatePage = (): boolean => isFullPagesPath() || !!oneShortlinkJob();

const bootOverlayLock = (): void => {
  const active = overlayActiveClass(OVERLAY_ID);
  document.documentElement.classList.add(active);
  if (document.getElementById(BOOT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = BOOT_STYLE_ID;
  style.textContent = buildFullPageOverlayCss(OVERLAY_ID, active);
  (document.head || document.documentElement).appendChild(style);
};

const stopPulse = (): void => {
  if (pulseTimer == null) return;
  clearInterval(pulseTimer);
  pulseTimer = null;
};

const paintPulse = (): void => {
  ui?.setStatus(`${statusBase}${'.'.repeat(pulseDots + 1)}`);
};

const startPulse = (base: string): void => {
  stopPulse();
  statusBase = base;
  pulseDots = 0;
  paintPulse();
  pulseTimer = window.setInterval(() => {
    pulseDots = (pulseDots + 1) % 3;
    paintPulse();
  }, PULSE_MS);
};

const show = (stage: Stage, error: string | null = null): FullPageOverlay => {
  bootOverlayLock();
  const note = { lead: stage.lead ?? LEAD, detail: stage.detail };
  if (ui) {
    ui.setNote(note);
    ui.setError(error);
  } else {
    ui = createFullPageOverlay({
      id: OVERLAY_ID,
      brand: 'Skip Wait',
      note,
      status: stage.status,
    });
    if (error) ui.setError(error);
  }
  if (error != null || stage.pulse === false) {
    stopPulse();
    ui.setStatus(stage.status);
  } else {
    startPulse(stage.status);
  }
  return ui;
};

const waitUnlock = async (): Promise<{ job: OneShortlinkJob; token: string }> => {
  const end = Date.now() + 8000;
  while (Date.now() < end) {
    const fromPage = unlockFromPage();
    const token = fromPage?.token?.trim() || csrfFromPage();
    if (fromPage && token) return { job: fromPage.job, token };
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('1shortlink unlock');
};

const runUnlock = async (): Promise<void> => {
  if (isFullPagesPath() && !unlockFromPage()) {
    show(STAGE.openGate);
    const next = await resolveFullPagesRedirect();
    if (next) {
      location.replace(next);
      return;
    }
  }
  show(STAGE.prepare);
  const { job, token } = await waitUnlock();
  show(STAGE.unlock);
  const { redirectUrl, shortenerId } = await postGetLinkDownload(job, token);
  if (shortenerId) {
    show(STAGE.continue);
    await postCheckClick(shortenerId, token);
  }
  show(STAGE.open);
  recordBypassSuccess();
  location.replace(redirectUrl);
};

const kick = (): void => {
  if (started || !isGatePage()) return;
  if (passwordRequired()) {
    show(STAGE.password);
    return;
  }
  started = true;
  void runUnlock().catch(() => {
    started = false;
    show(STAGE.failed, 'Reload this tab and try again.');
  });
};

export function init1shortlinkRedirect(): void {
  if (window !== window.top || !isGatePage()) return;
  void canBypass('oneshortlink').then((ok) => {
    if (!ok) return;
    show(STAGE.ready);
    whenDomParsed(kick);
    const mo = new MutationObserver(() => {
      kick();
      if (started) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  });
}
