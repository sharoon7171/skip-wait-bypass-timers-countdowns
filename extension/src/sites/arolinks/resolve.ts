import { isPleaseWaitHtml, isVpnHtml, pleaseWaitTarget, unlockDestinationFromHtml } from './gate';
import { type ArolinksProgress } from './hosts';
import { fetchHtml, fetchLastMediatorReferer } from './hop';

const NOTE = {
  ready: {
    lead: 'Hang tight — unlocking your link.',
    detail: 'Skip Wait is handling the waiting pages for you.',
  },
  unlock: {
    lead: 'Unlocking your link.',
    detail: "Skip Wait is finishing the unlock step for you. You don't need to tap anything.",
  },
  done: {
    lead: 'Almost there.',
    detail: 'Opening your destination now.',
  },
} as const;

const say = (
  onProgress: ((p: ArolinksProgress) => void) | undefined,
  status: string,
  note: { lead: string; detail: string },
): void => {
  onProgress?.({ ...note, status });
};

export const resolveMediatorReferer = async (
  shortUrl: string,
  onProgress?: (p: ArolinksProgress) => void,
): Promise<string> => {
  say(onProgress, 'Opening your short link', NOTE.ready);
  const seed = await fetchHtml(shortUrl, `${new URL(shortUrl).origin}/`);
  if (isVpnHtml(seed.html)) throw new Error('vpn');

  const assigned = pleaseWaitTarget(seed.html, shortUrl);
  if (!assigned) throw new Error('assigned');

  say(onProgress, 'Skipping wait pages', NOTE.ready);
  return fetchLastMediatorReferer(shortUrl, assigned);
};

export const resolveUnlockDestination = async (
  shortUrl: string,
  referer: string,
  onProgress?: (p: ArolinksProgress) => void,
): Promise<string> => {
  say(onProgress, 'Opening unlock page', NOTE.unlock);
  const unlock = await fetchHtml(shortUrl, referer);
  if (isVpnHtml(unlock.html) || isPleaseWaitHtml(unlock.html)) throw new Error('unlock');

  const dest = unlockDestinationFromHtml(unlock.html, shortUrl);
  if (!dest) throw new Error('dest');

  say(onProgress, 'Opening your link', NOTE.done);
  return dest;
};
