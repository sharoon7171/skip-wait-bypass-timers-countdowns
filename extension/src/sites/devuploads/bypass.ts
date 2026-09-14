import { recordBypassSuccess } from '../../free-bypass';
import { canBypass } from '../../gate';
import { whenDomParsed } from '../../utils/domain-check';
import {
  MSG_DEVUPLOADS_HOLD,
  MSG_DEVUPLOADS_RELEASE,
  SITE,
  fileIdFromHref,
  isDevuploadsFileUrlSync,
} from './hosts';
import { createOverlay } from './overlay';
import { requestCdn } from './resolve';

const ACTION = 'Direct Download · Skip Wait — No Timer, No Mediator';
const ERR_UNLOCK = 'Could not unlock this file. Reload and try again.';

let ui: ReturnType<typeof createOverlay> | null = null;
let started = false;

const fileMeta = (): { name: string; size: string } => {
  const name =
    document.querySelector<HTMLInputElement>('input[name="title"]')?.value.trim() ||
    document.querySelector('.file-info .name h4')?.textContent?.replace(/\s+/g, ' ').trim() ||
    '';
  const size =
    [...document.querySelectorAll<HTMLInputElement>('input[name="size"]')]
      .map((el) => el.value.trim())
      .find((v) => /\d/.test(v) && /[bkmgt]/i.test(v)) ||
    [...document.querySelectorAll('.file-info .name span')]
      .map((el) => el.textContent?.replace(/\s+/g, ' ').trim() ?? '')
      .find((t) => /\d/.test(t) && /[bkmgt]/i.test(t)) ||
    '';
  return { name, size };
};

export const initDevuploadsBypass = (): void => {
  if (window !== window.top) return;
  if (!isDevuploadsFileUrlSync(location.href)) return;

  chrome.runtime.sendMessage({ type: MSG_DEVUPLOADS_HOLD }).catch(() => {});

  const id = fileIdFromHref(location.href);
  if (!id) return;

  void canBypass(SITE).then((ok) => {
    if (!ok) {
      chrome.runtime.sendMessage({ type: MSG_DEVUPLOADS_RELEASE }).catch(() => {});
      return;
    }
    if (started) return;
    started = true;
    ui = createOverlay();
    ui.progress({ status: 'Getting things ready' });

    whenDomParsed(() => {
      const meta = fileMeta();
      ui!.progress({ status: 'Resolving direct CDN', ...meta });
      void requestCdn(id)
        .then((url) => {
          const ready = fileMeta();
          ui!.setReady({
            status: 'Ready — tap Direct Download when you want the file',
            name: ready.name || meta.name,
            size: ready.size || meta.size,
            url,
            action: ACTION,
          });
          recordBypassSuccess();
        })
        .catch(() => {
          started = false;
          ui!.setError('Unlock failed', ERR_UNLOCK);
        });
    });
  });
};
