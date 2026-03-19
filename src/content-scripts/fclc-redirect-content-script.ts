import { isAllowedHost } from '../utils/domain-check';
import { isCaptchaVerified } from '../utils/captcha-verifier';
import { isCloudflareHumanVerificationDone } from '../utils/cloudflare-verifier';

const CAPTCHA_IN_FORM = '[name="h-captcha-response"], [name="g-recaptcha-response"]';
const HOSTS = ['fc-lc.xyz', 'fc.lc'];
const LINK_VIEW = '#link-view';
const MSG_FCLC_ALERT_SUPPRESS = 'FCLC_ALERT_SUPPRESS';
const SUBMIT_BTN = '#submitBtn';
const VERIFICATION_FORM = '#verificationForm';

function runCloudflarePart(form: HTMLFormElement): void {
  const btn = document.querySelector<HTMLButtonElement>(SUBMIT_BTN);
  if (!btn) return;
  let done = false;
  const check = (): void => {
    if (done || !isCloudflareHumanVerificationDone(form) || btn.disabled) return;
    done = true;
    obs.disconnect();
    requestAnimationFrame(() => btn.click());
  };
  const obs = new MutationObserver(check);
  obs.observe(form, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
  obs.observe(btn, { attributes: true, attributeFilter: ['disabled'] });
  check();
}

function runHcaptchaPart(form: HTMLFormElement): void {
  if (!form.querySelector(CAPTCHA_IN_FORM)) return;
  let done = false;
  const check = (): void => {
    if (done || !isCaptchaVerified(form)) return;
    done = true;
    obs.disconnect();
    form.submit();
  };
  const obs = new MutationObserver(check);
  obs.observe(form, { childList: true, subtree: true, attributes: true });
  check();
}

function run(): void {
  const linkView = document.querySelector<HTMLFormElement>(LINK_VIEW);
  if (linkView) {
    runHcaptchaPart(linkView);
    return;
  }
  const verificationForm = document.querySelector<HTMLFormElement>(VERIFICATION_FORM);
  if (verificationForm) runCloudflarePart(verificationForm);
}

export function initFclcRedirect(): void {
  if (!isAllowedHost(HOSTS)) return;
  chrome.runtime.sendMessage({ type: MSG_FCLC_ALERT_SUPPRESS }).catch(() => {});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
}
