import { recordBypassSuccess } from '../../free-bypass';
import { canBypass } from '../../gate';

const SOURCE = 'skip-wait-xfree';
const TYPE = 'ads-cleared';

export function initXfreeCount(): void {
  try {
    if (!/(^|\.)xfree\.com$/i.test(location.hostname)) return;
  } catch {
    return;
  }

  let counted = false;
  window.addEventListener('message', (ev: MessageEvent) => {
    if (counted || ev.source !== window || ev.origin !== location.origin) return;
    const data = ev.data as { source?: string; type?: string };
    if (data?.source !== SOURCE || data.type !== TYPE) return;
    void canBypass('xfree').then((ok) => {
      if (!ok || counted) return;
      counted = true;
      recordBypassSuccess();
    });
  });
}
