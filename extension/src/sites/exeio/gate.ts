import { recordBypassSuccess } from '../../free-bypass';
import { canBypass } from '../../gate';
import { createFullPageOverlay, type FullPageOverlay } from '../../injected-ui/full-page-overlay';
import { pinSiteWidgetOverOverlay } from '../../injected-ui/pin-site-widget';
import { whenDomReady } from '../../utils/domain-check';
import { MSG_EXEIO_ADBLOCK, MSG_EXEIO_GO_UNLOCK, type ExeioUnlockResult } from './hosts';

const OVERLAY_ID = 'skip-wait-exeio-overlay';
const CAPTCHA_PIN_STYLE_ID = 'skip-wait-exeio-captcha-pin';
const CAPTCHA_WIDGET_ID = 'captchaShortlink';
const TURNSTILE = '[name="cf-turnstile-response"]';
const TURNSTILE_FRAMES = ['iframe[src*="challenges.cloudflare.com"]', 'iframe[src*="turnstile"]'] as const;
const PULSE_MS = 450;
const LEAD = 'Unlocking your link.';

type Stage = {
  lead?: string;
  detail: string;
  status: string;
  pulse?: boolean;
};

const STAGE = {
  ready: {
    detail: 'Skip Wait runs Continue, captcha, and Get Link on this page.',
    status: 'Getting things ready',
  },
  adblock: {
    detail: 'Clearing the adblock warning so the gate can continue.',
    status: 'Clearing adblock gate',
  },
  continue: {
    detail: 'Skipping the first Continue step for you.',
    status: 'Skipping Continue',
  },
  captchaWait: {
    lead: 'Confirm you’re human.',
    detail: 'Complete the check below. Skip Wait continues when it is done.',
    status: 'Waiting for captcha',
  },
  captchaLoad: {
    lead: 'Confirm you’re human.',
    detail: 'Complete the check below. Skip Wait continues when it is done.',
    status: 'Loading captcha',
  },
  captchaAct: {
    lead: 'Confirm you’re human.',
    detail: 'Complete the check below. Skip Wait continues when it is done.',
    status: 'Complete the captcha below',
    pulse: false,
  },
  captchaOk: {
    detail: 'Captcha passed. Moving to the next step.',
    status: 'Captcha verified',
  },
  captchaSubmit: {
    detail: 'Submitting the captcha step.',
    status: 'Submitting captcha',
  },
  goWait: {
    detail: 'Waiting out the Get Link timer this page still enforces.',
    status: 'Waiting for Get Link',
    pulse: false,
  },
  goOpen: {
    detail: 'Opening your destination.',
    status: 'Opening your link',
  },
} as const satisfies Record<string, Stage>;

type Phase = 'before' | 'link' | 'go';
type PinPhase = { stopPin: (() => void) | null };

let ui: FullPageOverlay | null = null;
let started = false;
let pulseTimer: number | null = null;
let pulseDots = 0;
let statusBase = '';

const msg = (type: string): void => {
  chrome.runtime.sendMessage({ type }).catch(() => {});
};

const stopPulse = (): void => {
  if (pulseTimer == null) return;
  clearInterval(pulseTimer);
  pulseTimer = null;
};

const paintPulse = (): void => {
  ui?.setStatus(`${statusBase}${'.'.repeat(pulseDots + 1)}`);
};

const startPulse = (base: string): void => {
  stopPulse();
  statusBase = base;
  pulseDots = 0;
  paintPulse();
  pulseTimer = window.setInterval(() => {
    pulseDots = (pulseDots + 1) % 3;
    paintPulse();
  }, PULSE_MS);
};

const show = (stage: Stage, error: string | null = null): FullPageOverlay => {
  const note = { lead: stage.lead ?? LEAD, detail: stage.detail };
  if (ui) {
    ui.setNote(note);
    ui.setError(error);
  } else {
    ui = createFullPageOverlay({
      id: OVERLAY_ID,
      brand: 'Skip Wait',
      note,
      status: stage.status,
      countdownLabel: 'Get Link ready in',
    });
    if (error) ui.setError(error);
  }
  if (error != null || stage.pulse === false) {
    stopPulse();
    ui.setStatus(stage.status);
  } else {
    startPulse(stage.status);
  }
  return ui;
};

const fail = (detail: string): void => {
  stopPulse();
  ui?.hideCountdown();
  show(
    {
      lead: 'Unlock did not finish.',
      detail,
      status: 'Something went wrong',
      pulse: false,
    },
    'Reload this tab and try again.',
  );
};

const nativeSubmit = (form: HTMLFormElement): void => {
  if (!form.getAttribute('action')) form.action = location.pathname;
  form.method = 'post';
  HTMLFormElement.prototype.submit.call(form);
};

const turnstileToken = (root: ParentNode = document): string | null => {
  for (const el of root.querySelectorAll(TURNSTILE)) {
    const v = (el as HTMLInputElement).value.trim();
    if (v.length > 20) return v;
  }
  return null;
};

const turnstileWidget = (form: Element): HTMLElement | null =>
  form.querySelector<HTMLElement>(`#${CAPTCHA_WIDGET_ID}`) ??
  form.querySelector<HTMLElement>('.cf-turnstile') ??
  form.querySelector(TURNSTILE)?.parentElement ??
  null;

const phase = (): Phase | null => {
  if (document.getElementById('before-captcha')) return 'before';
  if (document.getElementById('link-view') || document.querySelector('.link-container .button.disabled.danger')) {
    return 'link';
  }
  if (document.getElementById('go-link')?.querySelector('[name=ad_form_data]')) return 'go';
  return null;
};

const requestGoUnlock = (): Promise<ExeioUnlockResult> =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: MSG_EXEIO_GO_UNLOCK }, (res) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false, err: chrome.runtime.lastError.message ?? 'runtime error' });
        return;
      }
      const out = res as ExeioUnlockResult | undefined;
      resolve(out?.ok ? { ok: true } : { ok: false, err: out?.err ?? 'no response' });
    });
  });

const waitForGoSubmit = (): Promise<void> => {
  const ready = (): boolean => {
    const btn = document.getElementById('go-submit');
    return btn instanceof HTMLButtonElement && !btn.disabled && !btn.classList.contains('disabled');
  };
  if (ready()) return Promise.resolve();
  return new Promise((resolve) => {
    const mo = new MutationObserver(() => {
      if (!ready()) return;
      mo.disconnect();
      resolve();
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'class'],
    });
  });
};

const goCountdownEndAt = (): number => {
  const timer = document.getElementById('timer')?.textContent?.trim();
  const fromTimer = timer ? parseFloat(timer) : Number.NaN;
  if (Number.isFinite(fromTimer) && fromTimer > 0) return Date.now() + fromTimer * 1000;
  const av = (window as Window & { app_vars?: { counter_value?: string } }).app_vars;
  const sec = parseInt(String(av?.counter_value ?? ''), 10);
  return Date.now() + (Number.isFinite(sec) ? sec : 6) * 1000 + 500;
};

async function runBeforeCaptcha(): Promise<void> {
  let form = document.getElementById('before-captcha') as HTMLFormElement | null;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.querySelector('.button.disabled.danger') && !form.querySelector('[name=f_n]')) {
    show(STAGE.adblock);
    msg(MSG_EXEIO_ADBLOCK);
    await whenDomReady(() => {
      const f = document.getElementById('before-captcha');
      return f instanceof HTMLFormElement && !!f.querySelector('[name=f_n]');
    });
    form = document.getElementById('before-captcha') as HTMLFormElement | null;
    if (!(form instanceof HTMLFormElement)) {
      fail('The adblock warning is still blocking Continue.');
      return;
    }
  }

  if (!form.querySelector('[name=_csrfToken]')) {
    fail('The Continue gate was not ready.');
    return;
  }

  const fn = form.querySelector<HTMLInputElement>('[name=f_n]');
  if (fn) fn.value = 'sle';
  show(STAGE.continue);
  nativeSubmit(form);
}

function runLinkViewCaptcha(overlay: FullPageOverlay): Promise<string | null> {
  const prefilled = turnstileToken(document);
  if (prefilled && document.getElementById('link-view')) return Promise.resolve(prefilled);

  return new Promise((resolve) => {
    const pin: PinPhase = { stopPin: null };
    let done = false;
    const finish = (token: string | null): void => {
      if (done) return;
      done = true;
      obs.disconnect();
      clearTimeout(cap);
      pin.stopPin?.();
      resolve(token);
    };
    const check = (): void => {
      if (done) return;
      const token = turnstileToken(document);
      if (token && document.getElementById('link-view')) {
        show(STAGE.captchaOk);
        finish(token);
        return;
      }
      const form = document.getElementById('link-view');
      if (!form && document.querySelector('.button.disabled.danger')) {
        show(STAGE.adblock);
        msg(MSG_EXEIO_ADBLOCK);
        return;
      }
      if (!(form instanceof HTMLFormElement)) return;
      const widget = turnstileWidget(form);
      if (!widget) return;
      if (!widget.id) widget.id = CAPTCHA_WIDGET_ID;
      if (!pin.stopPin) {
        pin.stopPin = pinSiteWidgetOverOverlay({
          overlayId: OVERLAY_ID,
          mount: overlay.turnstileMount,
          widgetId: widget.id,
          styleId: CAPTCHA_PIN_STYLE_ID,
          alsoVisibleSelectors: TURNSTILE_FRAMES,
        });
        show(
          TURNSTILE_FRAMES.some((s) => form.querySelector(s)) ? STAGE.captchaAct : STAGE.captchaLoad,
        );
      }
    };
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
    check();
    const cap = setTimeout(() => finish(turnstileToken(document)), 180_000);
  });
}

async function runLinkView(overlay: FullPageOverlay): Promise<void> {
  if (!document.getElementById('link-view') && !document.querySelector('.link-container .button.disabled.danger')) {
    return;
  }
  show(STAGE.captchaWait);
  msg(MSG_EXEIO_ADBLOCK);
  const token = await runLinkViewCaptcha(overlay);
  if (!token) {
    fail('The captcha was not completed.');
    return;
  }
  const form = document.getElementById('link-view');
  if (!(form instanceof HTMLFormElement)) {
    fail('The captcha form was removed.');
    return;
  }
  const fn = form.querySelector<HTMLInputElement>('[name=f_n]');
  if (fn) fn.value = 'slc';
  let input = form.querySelector<HTMLInputElement>(TURNSTILE);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'cf-turnstile-response';
    form.appendChild(input);
  }
  input.value = token;
  show(STAGE.captchaSubmit);
  nativeSubmit(form);
}

async function runGoLink(overlay: FullPageOverlay): Promise<void> {
  const form = document.getElementById('go-link');
  if (!(form instanceof HTMLFormElement) || !form.querySelector('[name=ad_form_data]')) return;

  msg('INJECT_VISIBILITY_SPOOF');
  msg(MSG_EXEIO_ADBLOCK);
  show(STAGE.goWait);
  overlay.startCountdown(goCountdownEndAt());
  await waitForGoSubmit();
  overlay.hideCountdown();

  if (!document.getElementById('go-link')?.querySelector('[name=ad_form_data]')) {
    fail('The Get Link form was removed.');
    return;
  }

  show(STAGE.goOpen);
  const res = await requestGoUnlock();
  if (!res.ok) {
    fail(res.err ?? 'Get Link unlock failed.');
    return;
  }
  recordBypassSuccess();
}

async function runPipeline(): Promise<void> {
  const step = phase();
  if (!step) return;
  msg(MSG_EXEIO_ADBLOCK);
  msg('INJECT_VISIBILITY_SPOOF');
  show(STAGE.ready);
  switch (step) {
    case 'before':
      await runBeforeCaptcha();
      break;
    case 'link':
      await runLinkView(ui!);
      break;
    case 'go':
      await runGoLink(ui!);
      break;
  }
}

export function initExeioGate(): void {
  if (window !== window.top || started) return;
  void canBypass('exeio').then((ok) => {
    if (!ok || started) return;

    const kick = (): boolean => {
      if (started || !phase()) return false;
      started = true;
      void runPipeline();
      return true;
    };

    if (kick()) return;

    const mo = new MutationObserver(() => {
      if (kick()) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    const stopWatch = (): void => {
      window.setTimeout(() => {
        if (!started) mo.disconnect();
      }, 8000);
    };
    if (document.readyState === 'complete') stopWatch();
    else window.addEventListener('load', stopWatch, { once: true });
  });
}
