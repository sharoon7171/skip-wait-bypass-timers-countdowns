import { overlayActiveClass, overlayClasses } from './overlay-styles';

export type PinSiteWidgetOptions = {
  overlayId: string;
  mount: HTMLElement;
  widgetId: string;
  styleId: string;
  alsoVisibleSelectors?: readonly string[];
};

export function pinSiteWidgetOverOverlay(options: PinSiteWidgetOptions): () => void {
  const { overlayId, mount, widgetId, styleId, alsoVisibleSelectors = [] } = options;
  const activeClass = overlayActiveClass(overlayId);
  const pinClass = overlayClasses.turnstilePin;

  let style = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.documentElement.appendChild(style);
  }

  const alsoCss = alsoVisibleSelectors
    .map(
      (sel) =>
        `html.${activeClass} ${sel},html.${activeClass} ${sel} *{visibility:visible!important;pointer-events:auto!important}`,
    )
    .join('');

  let lastKey = '';
  let observedBox: HTMLElement | null = null;
  let raf = 0;

  const clearMount = (): void => {
    mount.classList.remove(pinClass);
    mount.style.removeProperty('height');
    mount.style.removeProperty('min-height');
  };

  const boxRo = new ResizeObserver(() => schedule());
  const mountRo = new ResizeObserver(() => schedule());

  const paint = (): void => {
    const box = document.getElementById(widgetId);
    if (!box) {
      if (observedBox) {
        boxRo.unobserve(observedBox);
        observedBox = null;
      }
      clearMount();
      style!.textContent = '';
      lastKey = '';
      return;
    }

    if (observedBox !== box) {
      if (observedBox) boxRo.unobserve(observedBox);
      observedBox = box;
      boxRo.observe(box);
    }

    box.classList.remove('hidden');
    mount.classList.add(pinClass);

    const width = Math.round(Math.max(300, mount.getBoundingClientRect().width || 300));
    const height = Math.round(
      Math.max(70, box.getBoundingClientRect().height || box.offsetHeight || 70),
    );
    mount.style.minHeight = `${height}px`;
    mount.style.height = `${height}px`;

    const r = mount.getBoundingClientRect();
    const top = Math.round(Math.max(8, r.top));
    const left = Math.round(Math.max(8, r.left));
    const key = `${top}|${left}|${width}|${height}`;
    if (key === lastKey && style!.textContent) return;
    lastKey = key;
    style!.textContent =
      alsoCss +
      `html.${activeClass} #${widgetId},html.${activeClass} #${widgetId} *{visibility:visible!important;pointer-events:auto!important}` +
      `html.${activeClass} #${widgetId}{position:fixed!important;left:${left}px!important;top:${top}px!important;width:${width}px!important;min-height:70px!important;z-index:2147483647!important;display:block!important;margin:0!important;transform:none!important;opacity:1!important;height:auto!important}`;
  };

  const schedule = (): void => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      paint();
    });
  };

  mountRo.observe(mount);
  const mo = new MutationObserver(schedule);
  mo.observe(document.documentElement, {
    attributeFilter: ['class', 'hidden', 'style'],
    attributes: true,
    childList: true,
    subtree: true,
  });
  window.addEventListener('resize', schedule);
  schedule();

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    mo.disconnect();
    mountRo.disconnect();
    boxRo.disconnect();
    window.removeEventListener('resize', schedule);
    clearMount();
    style?.remove();
  };
}
