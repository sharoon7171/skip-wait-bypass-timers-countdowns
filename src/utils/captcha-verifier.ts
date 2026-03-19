const CF_CLEARANCE_REGEX = /\bcf_clearance=([^;]+)/;
const RESPONSE_NAMES = ['h-captcha-response', 'g-recaptcha-response', 'cf-turnstile-response'];

type QueryRoot = Document | Element | ShadowRoot;

function getCfClearance(): boolean {
  if (typeof document === 'undefined' || !document.cookie) return false;
  return CF_CLEARANCE_REGEX.test(document.cookie);
}

function hasTokenInRoot(root: QueryRoot, names: string[]): boolean {
  for (const name of names) {
    for (const el of root.querySelectorAll(`[name="${name}"]`)) {
      const v = (el as HTMLInputElement | HTMLTextAreaElement).value?.trim();
      if (v?.length) return true;
    }
  }
  return false;
}

function* walkShadowRoots(root: QueryRoot): Generator<QueryRoot> {
  yield root;
  for (const el of root.querySelectorAll('*')) {
    if (el.shadowRoot) {
      yield el.shadowRoot;
      yield* walkShadowRoots(el.shadowRoot);
    }
  }
}

export const CAPTCHA_RESPONSE_SELECTORS = RESPONSE_NAMES.map((n) => `[name="${n}"]`).join(', ');

export function hasCaptchaToken(container: QueryRoot | undefined, names: string[]): boolean {
  const root = container ?? document;
  for (const scope of walkShadowRoots(root)) {
    if (hasTokenInRoot(scope, names)) return true;
  }
  return false;
}

export function isCaptchaVerified(container?: Element): boolean {
  const root = container ?? document;
  return hasCaptchaToken(root, RESPONSE_NAMES) || getCfClearance();
}
