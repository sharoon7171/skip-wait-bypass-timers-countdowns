import { MSG_DEVUPLOADS_HOLD, MSG_DEVUPLOADS_RELEASE, isDevuploadsFileUrlSync } from './hosts';

function runHoldState(release: boolean): void {
  type HoldWin = Window & {
    __swDevuploadsHold?: boolean;
    __swDevuploadsNativeSubmit?: typeof HTMLFormElement.prototype.submit;
    __swDevuploadsNativeRequestSubmit?: typeof HTMLFormElement.prototype.requestSubmit;
  };

  const w = window as HoldWin;
  const sameHost = (form: HTMLFormElement): boolean => {
    try {
      const host = new URL(form.getAttribute('action') || form.action || location.href, location.href)
        .hostname.toLowerCase();
      const here = location.hostname.toLowerCase();
      return host === here || host.endsWith('.devuploads.com');
    } catch {
      return false;
    }
  };

  if (release) {
    if (!w.__swDevuploadsHold) return;
    if (w.__swDevuploadsNativeSubmit) HTMLFormElement.prototype.submit = w.__swDevuploadsNativeSubmit;
    if (w.__swDevuploadsNativeRequestSubmit) {
      HTMLFormElement.prototype.requestSubmit = w.__swDevuploadsNativeRequestSubmit;
    }
    w.__swDevuploadsHold = false;
    const form = document.getElementById('downloadpage');
    const native = w.__swDevuploadsNativeSubmit;
    if (!(form instanceof HTMLFormElement) || !native) return;
    try {
      if (!sameHost(form)) native.call(form);
    } catch {}
    return;
  }

  if (w.__swDevuploadsHold) return;
  w.__swDevuploadsHold = true;
  w.__swDevuploadsNativeSubmit = HTMLFormElement.prototype.submit;
  w.__swDevuploadsNativeRequestSubmit = HTMLFormElement.prototype.requestSubmit;

  HTMLFormElement.prototype.submit = function (this: HTMLFormElement) {
    if (!sameHost(this)) return;
    return w.__swDevuploadsNativeSubmit!.call(this);
  };

  if (typeof w.__swDevuploadsNativeRequestSubmit === 'function') {
    HTMLFormElement.prototype.requestSubmit = function (
      this: HTMLFormElement,
      submitter?: HTMLElement,
    ) {
      if (!sameHost(this)) return;
      return w.__swDevuploadsNativeRequestSubmit!.call(this, submitter as HTMLButtonElement | undefined);
    };
  }

  document.addEventListener(
    'submit',
    (ev) => {
      const t = ev.target;
      if (!(t instanceof HTMLFormElement) || sameHost(t)) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
    },
    true,
  );
}

const inject = (tabId: number, frameId: number, release: boolean): void => {
  void chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId] },
    world: 'MAIN',
    injectImmediately: true,
    func: runHoldState,
    args: [release],
  });
};

export const initDevuploadsHoldNav = (): void => {
  const holdNav = (frameId: number, tabId: number, url: string): void => {
    if (frameId !== 0 || !isDevuploadsFileUrlSync(url)) return;
    inject(tabId, 0, false);
  };

  chrome.webNavigation.onCommitted.addListener(({ frameId, tabId, url }) => {
    holdNav(frameId, tabId, url);
  });
  chrome.webNavigation.onDOMContentLoaded.addListener(({ frameId, tabId, url }) => {
    holdNav(frameId, tabId, url);
  });

  chrome.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab?.id;
    if (tabId === undefined) return false;
    const href = sender.tab?.url ?? '';
    if (href && !isDevuploadsFileUrlSync(href)) return false;
    const frameId = sender.frameId ?? 0;
    if (message?.type === MSG_DEVUPLOADS_HOLD) {
      inject(tabId, frameId, false);
      return false;
    }
    if (message?.type === MSG_DEVUPLOADS_RELEASE) {
      inject(tabId, frameId, true);
      return false;
    }
    return false;
  });
};
