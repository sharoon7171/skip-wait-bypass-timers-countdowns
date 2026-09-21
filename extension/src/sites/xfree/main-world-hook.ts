export function runXfreeAdSlideBypass(): void {
  type XfreeWin = Window & { __swXfreeAds?: boolean };
  const w = window as XfreeWin;
  if (w.__swXfreeAds) return;
  w.__swXfreeAds = true;

  const FEED = new Set(['feed_desktop', 'feed_mobile']);
  const MARK = '__swXfreeVwb';

  type Watcher = { getter: () => unknown; evaluate: () => void };
  type VueVm = {
    $options?: { name?: string; computed?: Record<string, unknown> };
    $children?: VueVm[];
    videos?: unknown[];
    activeVideoID?: unknown;
    prevIndex?: number;
    lockSlide?: number | null;
    moveVideoElement?: (id: unknown) => void;
    _computedWatchers?: Record<string, Watcher>;
    constructor?: { options?: { computed?: Record<string, unknown> } };
  };

  type MarkedFn = ((this: VueVm) => unknown[]) & { [MARK]?: boolean };

  const marked = (): MarkedFn => {
    const fn: MarkedFn = function (this: VueVm) {
      const list = this.videos;
      return Array.isArray(list) ? list.slice() : [];
    };
    fn[MARK] = true;
    return fn;
  };

  const leaveBanner = (vm: VueVm): void => {
    const id = vm.activeVideoID;
    if (id == null || typeof id !== 'object') return;
    if (!(id as { isBannerPlaceholder?: boolean }).isBannerPlaceholder) return;
    const vids = Array.isArray(vm.videos) ? vm.videos : [];
    if (!vids.length) return;
    const i = Math.min(Math.max(0, vm.prevIndex ?? 0), vids.length - 1);
    vm.lockSlide = null;
    vm.moveVideoElement?.(vids[i]);
  };

  const patchWatcher = (vm: VueVm): boolean => {
    const watcher = vm._computedWatchers?.['videosWithBanners'];
    if (!watcher || typeof watcher.getter !== 'function') return false;
    if ((watcher.getter as MarkedFn)[MARK]) return true;
    watcher.getter = marked();
    watcher.evaluate();
    return true;
  };

  const patchOptions = (vm: VueVm): void => {
    const replace = (bag: Record<string, unknown> | undefined): void => {
      const cur = bag?.['videosWithBanners'];
      if (typeof cur !== 'function') return;
      if ((cur as MarkedFn)[MARK]) return;
      bag!['videosWithBanners'] = marked();
    };
    replace(vm.$options?.computed);
    replace(vm.constructor?.options?.computed);
  };

  const findFeed = (root: VueVm | undefined): VueVm | null => {
    if (!root) return null;
    const q: VueVm[] = [root];
    for (let i = 0; i < q.length; i++) {
      const vm = q[i]!;
      if (FEED.has(vm.$options?.name ?? '') && Array.isArray(vm.videos)) return vm;
      const kids = vm.$children;
      if (kids) for (let j = 0; j < kids.length; j++) q.push(kids[j]!);
    }
    return null;
  };

  let signaled = false;
  const tryPatch = (): boolean => {
    const el = document.getElementById('__nuxt') as (HTMLElement & { __vue__?: VueVm }) | null;
    const feed = findFeed(el?.__vue__);
    if (!feed || !patchWatcher(feed)) return false;
    patchOptions(feed);
    leaveBanner(feed);
    if (!signaled) {
      signaled = true;
      window.postMessage({ source: 'skip-wait-xfree', type: 'ads-cleared' }, '*');
    }
    return true;
  };

  if (tryPatch()) return;

  const mo = new MutationObserver(() => {
    if (tryPatch()) mo.disconnect();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => mo.disconnect(), 60_000);
}
