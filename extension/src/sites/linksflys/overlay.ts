import { createFullPageOverlay, type FullPageOverlay } from '../../injected-ui/full-page-overlay';
import { overlayActiveClass } from '../../injected-ui/overlay-styles';
import type { LinksflysProgress } from './hosts';

const ID = 'skip-wait-linksflys';

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
  let frozen = false;

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
    ui.setStatus(frozen ? baseStatus : pulsedStatus());
    if (!frozen && counting && countEndTs > Date.now()) ui.startCountdown(countEndTs);
  };

  const syncPulse = (): void => {
    if (frozen) return;
    pulseDots = 0;
    ensure();
    paintStatus();
    if (pulseTimer != null) return;
    pulseTimer = window.setInterval(() => {
      if (frozen || !ui) return;
      pulseDots = (pulseDots + 1) % 3;
      paintStatus();
    }, 450);
  };

  return {
    progress: (p: LinksflysProgress) => {
      frozen = false;
      baseLead = p.lead;
      baseDetail = p.detail;
      baseStatus = stripDots(p.status);
      if (typeof p.waitEndTs === 'number' && p.waitEndTs > Date.now()) {
        counting = true;
        countEndTs = p.waitEndTs;
      } else {
        counting = false;
        countEndTs = 0;
        ui?.hideCountdown();
      }
      syncPulse();
      return ui!;
    },
    setError: (status: string) => {
      frozen = true;
      counting = false;
      countEndTs = 0;
      stopPulse();
      ui?.hideCountdown();
      baseStatus = stripDots(status);
      const overlay = ensure();
      overlay.setNote({
        lead: 'Something went wrong.',
        detail: 'Reload this page and try again.',
      });
      overlay.setStatus(baseStatus);
      return overlay;
    },
  };
};
