import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'Exe.io';

const bypassType = 'Skip Waiting Page';

const description =
  'Clear Exe.io and exeygo waiting pages with Skip Wait. This Chrome extension opens your destination once the unlock timer completes. Exe.io bypass for those pages.';

const domains = ['exe.io', 'exeygo.com'] as const;

const keywords = [
  'exe.io bypass',
  'Exe.io bypass extension',
  'exe.io timer bypass',
  'exe.io get link',
  'exe.io continue bypass',
  'exeygo bypass',
  'exeygo.com bypass',
  'exeygo get link',
  'exeygo turnstile',
  'skip waiting page',
  'please wait bypass',
  'waiting page bypass',
  'skip click to continue',
  'get link bypass',
  'get link timer bypass',
  'bypass countdown timer',
  'skip countdown timer',
  'link shortener bypass',
  'skip wait extension',
] as const;

const intro =
  'Exe.io and exeygo short links usually present three unlock stages: Continue, a captcha check, then Get Link with a countdown. Skip Wait runs those steps in Chrome when a waiting gate is on the page, waits the real Get Link timer, and opens your link.';

const body = `## Three Unlock Stages on Exe.io

One Exe.io or exeygo short link rarely opens the final file in a single load. First comes Continue (please wait or click to go on). Next is often captcha (“I am not a robot”). Last is Get Link, where a countdown still runs before unlock. Only that last timer is a real hold Skip Wait must wait. The earlier stages are Continue and captcha checks, not a clock Skip Wait erases.

exeygo uses the same unlock pattern as Exe.io for these gates. Skip Wait treats matching waiting pages on both brands the same. The ordinary homepage or marketing page has no Continue, captcha, or Get Link gate, so Skip Wait does not run there. This Exe.io bypass applies only when an unlock waiting page is present.

### Unlock Order

1. **Continue:** move past the first please wait or continue step
2. **Captcha:** complete “I am not a robot” when the site shows it
3. **Get Link:** wait the countdown, then open the destination

Closing the tab mid-way often restarts the full sequence. Keep the tab open and let Skip Wait complete each stage.

## What Skip Wait Does on Each Stage

You stay on the same Chrome tab. You do not paste the link into another tool.

**Continue:** Skip Wait advances that step and clears “turn off your ad blocker” messages that hide the button.

**Captcha:** Skip Wait shows the check on screen. Complete it once; Skip Wait continues afterward.

**Get Link:** Skip Wait follows the countdown the page still shows, waits it out, then unlocks and opens your destination. That is a get link timer bypass that respects the real hold, not a fake skip that returns you to Continue.

## Captcha and Ad Blocker Warnings

If captcha appears, complete it where Skip Wait shows it, then let Skip Wait move to Get Link. If an ad blocker warning removes Continue or captcha, Skip Wait clears that warning so the real controls return.

Open the short link as usual. When Continue, captcha, or Get Link is visible, Skip Wait can assist on that stage.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'What does Skip Wait skip on Exe.io?',
    answer:
      'Manual Continue clicks, most of the captcha step after you verify once, and pressing Get Link yourself on supported Exe.io and exeygo waiting pages. The Get Link countdown is still waited, then your link opens.',
  },
  {
    question: 'Is every timer removed?',
    answer:
      'No. Only Get Link has a real timer. Continue and captcha proceed as soon as the page allows.',
  },
  {
    question: 'Do I still complete the captcha?',
    answer: 'Yes, once where Skip Wait shows it. After that, Skip Wait continues to Get Link.',
  },
  {
    question: 'Why does nothing happen on the exeygo homepage?',
    answer:
      'Skip Wait starts only when Continue, captcha, or Get Link is on the page, not on the plain homepage.',
  },
  {
    question: 'Do I click Continue or Get Link myself?',
    answer: 'On supported waiting pages, no. Skip Wait handles those steps in the same tab.',
  },
  {
    question: 'Is exeygo the same as Exe.io here?',
    answer: 'Yes for matching waiting pages. Open the link as usual; Skip Wait uses the same path on both.',
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
