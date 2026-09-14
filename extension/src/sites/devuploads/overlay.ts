import { createFullPageOverlay, type FullPageOverlay } from '../../injected-ui/full-page-overlay';
import { overlayActiveClass } from '../../injected-ui/overlay-styles';

const ID = 'skip-wait-devuploads';

type Progress = { status: string; name?: string; size?: string };

const stripDots = (text: string): string => text.replace(/\.+$/, '').replace(/…+$/, '');

const fileNote = (name: string, size = '') =>
  size
    ? { lead: name || 'Hang tight — unlocking your file.', detail: size }
    : { lead: name || 'Hang tight — unlocking your file.' };

export const createOverlay = () => {
  let ui: FullPageOverlay | null = null;
  let pulseTimer: number | null = null;
  let pulseDots = 0;
  let baseStatus = '';
  let baseName = '';
  let baseSize = '';

  const stopPulse = (): void => {
    if (pulseTimer == null) return;
    clearInterval(pulseTimer);
    pulseTimer = null;
  };

  const pulsedStatus = (): string => `${baseStatus}${'.'.repeat(pulseDots + 1)}`;

  const applyMeta = (p: Progress): void => {
    baseStatus = stripDots(p.status);
    if (p.name !== undefined) baseName = p.name;
    if (p.size !== undefined) baseSize = p.size;
  };

  const ensure = (): FullPageOverlay => {
    document.documentElement.classList.add(overlayActiveClass(ID));
    if (ui) return ui;
    ui = createFullPageOverlay({
      id: ID,
      brand: 'Skip Wait',
      note: fileNote(baseName, baseSize),
      status: pulsedStatus(),
    });
    return ui;
  };

  const syncPulse = (): void => {
    pulseDots = 0;
    const overlay = ensure();
    overlay.setNote(fileNote(baseName, baseSize));
    overlay.setStatus(pulsedStatus());
    overlay.setError(null);
    if (pulseTimer != null) return;
    pulseTimer = window.setInterval(() => {
      if (!ui) return;
      pulseDots = (pulseDots + 1) % 3;
      ui.setStatus(pulsedStatus());
    }, 450);
  };

  return {
    progress: (p: Progress) => {
      applyMeta(p);
      syncPulse();
      return ui!;
    },
    setReady: (p: Progress & { url: string; action: string }) => {
      stopPulse();
      applyMeta(p);
      const overlay = ensure();
      overlay.setNote(fileNote(baseName, baseSize));
      overlay.setStatus(baseStatus);
      overlay.setError(null);
      overlay.setAction(p.url, p.action);
      return overlay;
    },
    setError: (status: string, message: string) => {
      stopPulse();
      baseStatus = status;
      const overlay = ensure();
      overlay.setAction(null);
      overlay.setNote(fileNote(baseName, baseSize));
      overlay.setStatus(status);
      overlay.setError(message);
      return overlay;
    },
  };
};
