import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'Rare Study';

const bypassType = 'Skip Keygenerate Prolink';

const description =
  'Rare Study bypass clears Generate Access Key and TipsGuru prolink screens so Skip Wait lands you on Validating once the required hold finishes.';

const domains = ['rarestudy.in'] as const;

const keywords = [
  'rare study bypass',
  'rarestudy bypass',
  'rarestudy keygenerate',
  'rarestudy generate access key',
  'rarestudy access key',
  'rarestudy validating',
  'rarestudy access granted',
  'rarestudy tipsguru',
  'rarestudy verification failed',
  'generate access key bypass',
  'keygenerate bypass',
  'bypass detected rarestudy',
  'skip wait extension',
  'rarestudy chrome extension',
] as const;

const intro =
  'Rare Study’s keygenerate page will not open batches until Generate Access Key finishes a TipsGuru prolink and the site itself confirms the session. Skip Wait clears that TipsGuru leg—while Rare Study still needs its full ~250-second hold before Validating can succeed.';

const body = `## Keygenerate is a claim, not a download timer

On [Rare Study keygenerate](https://rarestudy.in/keygenerate) the card is short: **Generate Access Key**, a note that you will be redirected to a verification page, and **How to Generate Key**. Tap Generate Access Key and the button flips to Redirecting… while the site starts your key session and sends you to a TipsGuru prolink. Come back too early and Validating fails; cut the required wait short and you can hit Bypass Detected / Complete Process Through Official Method instead of Access Granted.

That is a rarestudy generate access key problem: the batches stay locked until keygenerate, TipsGuru, and Validating all agree—not until a video countdown ends.

### Beats on the real path

- **Generate Access Key** on keygenerate, then Redirecting…
- TipsGuru **prolink** screens Skip Wait already knows how to advance
- Return to Rare Study for **Validating…** / Verifying your key generation…
- **Access Granted!** with twenty-four hours, then Redirecting to rarestudy
- Or **Verification Failed** if the session or hold was wrong

## TipsGuru clears the prolink; Rare Study still times the claim

Generate Access Key does not invent a second shortener brand. The redirect is TipsGuru prolink access—the same family covered on the [TipsGuru bypass](/sites/tipsguru-bypass) page. Keep Skip Wait on that prolink tab so you are not babysitting every unlock gate by hand.

Rare Study’s own rule is separate: after Generate Access Key starts, the site expects about 250 seconds before Validating will accept the return. Cut that hold short and you get Bypass Detected, then a bounce back toward keygenerate. Skip Wait does not fake that clock; it only removes TipsGuru busywork so the honest Rare Study hold is the wait that remains.

## Access Granted means twenty-four hours on batches

When Validating succeeds you see Access Granted and a short countdown into the batches player with a day of access. If Verification Failed appears, start again from Generate Access Key, finish the TipsGuru prolink with Skip Wait, and let the Rare Study hold complete before you expect Access Granted.

How to Generate Key is only a Telegram help link. It does not replace the prolink or the required hold.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'Where does a Rare Study bypass start?',
    answer:
      'On keygenerate, where Generate Access Key begins the session and Redirecting… opens the TipsGuru prolink. Skip Wait runs on that prolink; Validating runs when you return.',
  },
  {
    question: 'Can Skip Wait skip the Rare Study 250-second hold?',
    answer:
      'No. That hold is checked when Validating runs. Finishing early can show Bypass Detected or Verification Failed instead of Access Granted.',
  },
  {
    question: 'Is this the same page as the TipsGuru catalog entry?',
    answer:
      'No. TipsGuru covers the prolink network. This page is for Rare Study’s Generate Access Key → Validating → Access Granted gate, including the hold you must respect.',
  },
  {
    question: 'What does Access Granted unlock?',
    answer:
      'Full Rare Study access for the next twenty-four hours, then a short Redirecting to rarestudy into the batches area.',
  },
];

export const bypass = {
  name,
  bypass: bypassType,
  description,
  domains,
  keywords,
  article: {
    intro,
    body,
    faq,
  },
} satisfies SupportedBypass;
