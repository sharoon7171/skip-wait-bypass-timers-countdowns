import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'PWX';

const bypassType = 'Skip Access Key Short Link';

const description =
  'PWX bypass clears Unlock 24 Hours Generate Key redirects so Skip Wait finishes the Arolinks short link and returns you to verify.';

const domains = ['pwx.pages.dev'] as const;

const keywords = [
  'pwx bypass',
  'pwx access key bypass',
  'pwx generate key bypass',
  'pwx unlock 24 hours',
  'pwx access gate',
  'pwx free batches access',
  'physics wallah free batches key',
  'pwx arolinks bypass',
  'generate key short link bypass',
  'access key verify bypass',
  'skip wait extension',
  'pwx chrome extension',
] as const;

const intro =
  'PWX Access asks for Unlock 24 Hours before free batches open: Generate Key sends you through an Arolinks short link, then Verify confirms the access key. Skip Wait finishes that Arolinks hop so you can land back on verify without babysitting Please Wait screens.';

const body = `## Unlock 24 Hours before the batches

On [PWX Access](https://pwx.pages.dev/access), the gate is blunt: Unlock 24 Hours, a short note to generate a key and complete the steps, then **Generate Key**. Tap it and the page shows Redirecting… while it stores a pending claim and opens an Arolinks short URL. Finish that shortener, return through **Verifying…**, and only then do you see Access Granted / Unlocked for 24 hours before the player loads.

People hunting a pwx bypass, pwx generate key bypass, or pwx access key bypass are stuck on that Generate Key → short link → verify loop—not on a lecture countdown inside a batch.

### What you actually tap

- **Unlock 24 Hours** copy on the access screen
- **Generate Key** (Redirecting… while the short link opens)
- **I already have an access key** when you want to paste one instead
- **Enter your access key** on the manual modal
- **Verifying…** / Access Granted after the shortener path completes

## Generate Key lands on Arolinks

PWX does not invent its own timer UI for this gate. Generate Key hands you to [Arolinks](/sites/arolinks-bypass)—Please Wait / Opening Link, then the unlock hold that shortener already uses. That is why a pwx arolinks bypass search and an Arolinks timer bypass are the same hop in practice: the access gate’s friction is the short link.

Skip Wait’s supported path for PWX is that Arolinks short link after Generate Key. Stay on the Arolinks tab with Skip Wait enabled; it covers the busy Please Wait UI, finishes the required unlock hold, and opens the destination so PWX can run verify and issue the 24-hour access key.

You do not need a separate paste tool for the Arolinks URL. Open Generate Key, let the short link load, and keep Skip Wait on that tab until verify can confirm the key.

## After verify, the key is yours for a day

When verify succeeds, PWX stores the access key for twenty-four hours and sends you into the free-batch player. If verification fails, Generate a new key from access and run the Arolinks hop again—Skip Wait still targets the shortener stage, not a fake “instant key” on the access card itself.

For the shortener stages in detail—Please Wait, unlock countdown, timed destination holds—use the [Arolinks bypass](/sites/arolinks-bypass) page. This PWX entry is the access-gate handoff: Unlock 24 Hours → Generate Key → Arolinks → verify.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'Which PWX screen starts this flow?',
    answer:
      'The access gate with Unlock 24 Hours and Generate Key. That button opens the Arolinks short link Skip Wait already supports.',
  },
  {
    question: 'Does Skip Wait invent a key on the access page?',
    answer:
      'No. Generate Key still prepares the claim; Skip Wait clears the Arolinks short link you are sent to, then PWX verify can finish and unlock for 24 hours.',
  },
  {
    question: 'Where should I leave Skip Wait running?',
    answer:
      'On the Arolinks short link after Generate Key. That is the hop with Please Wait and unlock countdowns; the PWX access card alone is only the start button.',
  },
  {
    question: 'What if I already have an access key?',
    answer:
      'Use I already have an access key on the access screen and paste it. That path skips Generate Key and does not need the Arolinks hop.',
  },
  {
    question: 'Is this the same as the Arolinks catalog page?',
    answer:
      'Related, not identical. This page is for the PWX Unlock 24 Hours / Generate Key gate. Arolinks has its own page for the short-link stages themselves.',
  },
  {
    question: 'Is Skip Wait free?',
    answer:
      'You get 5 free bypasses per day, a 30-minute unlimited free trial, or a $1.50/month license key for unlimited use. Activate a trial or key in the extension popup.',
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
