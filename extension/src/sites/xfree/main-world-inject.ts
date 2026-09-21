import { isXfreeUrl } from './hosts';
import { runXfreeAdSlideBypass } from './main-world-hook';

export function initXfreeMainWorldInject(): void {
  chrome.webNavigation.onCommitted.addListener((details) => {
    void isXfreeUrl(details.url).then((ok) => {
      if (!ok) return;
      void chrome.scripting.executeScript({
        target: { tabId: details.tabId, frameIds: [details.frameId] },
        world: 'MAIN',
        injectImmediately: true,
        func: runXfreeAdSlideBypass,
      });
    });
  });
}
