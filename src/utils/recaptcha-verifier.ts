export const RECAPTCHA_RESPONSE_SELECTOR =
  '#g-recaptcha-response, [name="g-recaptcha-response"]';

export function isRecaptchaVerified(container?: Element): boolean {
  const root = container ?? document;
  const el = root.querySelector<HTMLTextAreaElement>(RECAPTCHA_RESPONSE_SELECTOR);
  return !!(el?.value?.length);
}
