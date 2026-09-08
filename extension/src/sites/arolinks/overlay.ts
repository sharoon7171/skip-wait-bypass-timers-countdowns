import { createFullPageOverlay, type FullPageOverlay } from '../../injected-ui/full-page-overlay';
import { overlayActiveClass } from '../../injected-ui/overlay-styles';
import type { ArolinksProgress } from './hosts';

const ID = 'skip-wait-arolinks-unlock';

const stripDots = (text: string): string => text.replace(/\.+$/, '');

export const createOverlay = () => {
  let ui: FullPageOverlay | null = null;
  let pulseTimer: number | null = null;
  let pulseDots = 0;
  let baseStatus = '';
  let baseLead = '';
  let baseDetail = '';
  let counting = false;
  let countEndTs = 0;

  const stopPulse = (): void => {
    if (pulseTimer == null) return;
    clearInterval(pulseTimer);
    pulseTimer = null;
  };

  const pulsedStatus = (): string => `${baseStatus}${'.'.repeat(pulseDots + 1)}`;

  const ensure = (): FullPageOverlay => {
    document.documentElement.classList.add(overlayActiveClass(ID));
    if (ui) return ui;
    ui = createFullPageOverlay({
      id: ID,
      brand: 'Skip Wait',
      note: { lead: baseLead, detail: baseDetail },
      status: pulsedStatus(),
      countdownLabel: 'Your link opens in',
    });
    return ui;
  };

  const paintStatus = (): void => {
    if (!ui) return;
    ui.setNote({ lead: baseLead, detail: baseDetail });
    ui.setStatus(pulsedStatus());
    if (counting && countEndTs > Date.now()) ui.startCountdown(countEndTs);
  };

  const syncPulse = (): void => {
    pulseDots = 0;
    ensure();
    paintStatus();
    if (pulseTimer != null) return;
    pulseTimer = window.setInterval(() => {
      if (!ui) return;
      pulseDots = (pulseDots + 1) % 3;
      paintStatus();
    }, 450);
  };

  return {
    progress: (p: ArolinksProgress) => {
      baseStatus = stripDots(p.status);
      baseLead = p.lead;
      baseDetail = p.detail;
      syncPulse();
      return ui!;
    },
    startCountdown: (ms: number) => {
      counting = true;
      countEndTs = Date.now() + ms;
      ensure();
      paintStatus();
      return ui!;
    },
    hideCountdown: () => {
      counting = false;
      countEndTs = 0;
      ui?.hideCountdown();
    },
    setError: (status: string) => {
      counting = false;
      countEndTs = 0;
      stopPulse();
      ui?.hideCountdown();
      const overlay = ensure();
      overlay.setNote({
        lead: 'Something went wrong.',
        detail: 'Reload the short link and try again.',
      });
      overlay.setStatus(status);
      overlay.setError(status);
      return overlay;
    },
  };
};
