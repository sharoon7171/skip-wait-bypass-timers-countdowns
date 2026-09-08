import { recordBypassSuccess } from '../../free-bypass';
import { canBypassHost } from '../../gate';
import {
  AROLINKS_DEST_WAIT_MS,
  AROLINKS_UNLOCK_READY_MS,
  MSG_HOP,
  MSG_PROGRESS,
  MSG_UNLOCK,
  SITE,
  isShortUrl,
  isTimedDestUrl,
  isWorkingPage,
  type ArolinksProgress,
} from './hosts';
import { createOverlay } from './overlay';

const ui = createOverlay();

type HopRes = { ok?: boolean; referer?: string };
type UnlockRes = { ok?: boolean; dest?: string };

const requestHop = (unlockUrl: string): Promise<HopRes> =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: MSG_HOP, unlockUrl }, (res?: HopRes) => {
      resolve(res ?? { ok: false });
    });
  });

const requestUnlock = (unlockUrl: string, referer: string): Promise<UnlockRes> =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: MSG_UNLOCK, unlockUrl, referer }, (res?: UnlockRes) => {
      resolve(res ?? { ok: false });
    });
  });

const run = async (unlockUrl: string): Promise<void> => {
  const onProgress = (msg: { type?: string } & Partial<ArolinksProgress>): void => {
    if (msg.type !== MSG_PROGRESS || !msg.status || !msg.lead || !msg.detail) return;
    ui.progress({ lead: msg.lead, detail: msg.detail, status: msg.status });
  };
  chrome.runtime.onMessage.addListener(onProgress);

  try {
    ui.progress({
      lead: 'Hang tight — unlocking your link.',
      detail: 'Skip Wait is handling the waiting pages for you.',
      status: 'Opening your short link',
    });
    ui.startCountdown(AROLINKS_UNLOCK_READY_MS);

    let host: string;
    try {
      host = new URL(unlockUrl).hostname;
    } catch {
      ui.setError('Invalid unlock link.');
      return;
    }
    if (!(await canBypassHost(host, SITE))) {
      ui.setError('Arolinks is not available.');
      return;
    }

    const started = Date.now();
    const hop = await requestHop(unlockUrl);
    if (!hop.ok || !hop.referer) {
      ui.setError('Could not unlock.');
      return;
    }

    const left = Math.max(0, AROLINKS_UNLOCK_READY_MS - (Date.now() - started));
    if (left > 0) {
      ui.progress({
        lead: 'Unlocking your link.',
        detail: "Skip Wait is finishing the unlock step for you. You don't need to tap anything.",
        status: 'Waiting for unlock timer',
      });
      await new Promise<void>((r) => setTimeout(r, left));
    }

    const unlocked = await requestUnlock(unlockUrl, hop.referer);
    if (!unlocked.ok || !unlocked.dest) {
      ui.setError('Could not unlock.');
      return;
    }

    ui.hideCountdown();
    const dest = unlocked.dest;

    if (await isTimedDestUrl(dest)) {
      ui.progress({
        lead: 'Almost there.',
        detail: 'Waiting for the access window before opening your link.',
        status: 'Waiting for access window',
      });
      ui.startCountdown(AROLINKS_DEST_WAIT_MS);
      await new Promise<void>((r) => setTimeout(r, AROLINKS_DEST_WAIT_MS));
      ui.hideCountdown();
    }

    recordBypassSuccess();
    location.replace(dest);
  } catch {
    ui.setError('Could not unlock.');
  } finally {
    chrome.runtime.onMessage.removeListener(onProgress);
  }
};

export const initArolinksUnlock = (): void => {
  if (window !== window.top || !isWorkingPage()) return;
  const q = new URLSearchParams(location.search);
  if (q.get('site')?.trim() !== SITE) return;
  const unlockUrl = q.get('u')?.trim() ?? '';
  if (!isShortUrl(unlockUrl)) {
    ui.setError('Missing unlock details.');
    return;
  }
  void run(unlockUrl);
};
