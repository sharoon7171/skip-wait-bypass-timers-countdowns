import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = '1shortlink';

const bypassType = 'Skip Waiting Page';

const description =
  '1shortlink bypass with Skip Wait, a Chrome extension that clears Confirm continue waiting pages and opens your share when unlock is ready.';

const domains = ['1shortlink.com'] as const;

const keywords = [
  '1shortlink bypass',
  '1shortlink bypass chrome',
  '1shortlink bypass extension',
  'bypass 1shortlink',
  'skip 1shortlink',
  '1shortlink.com bypass',
  '1shortlink waiting page',
  '1shortlink continue skip',
  '1shortlink confirm continue',
  '1shortlink timer bypass',
  '1shortlink countdown bypass',
  'skip waiting page',
  'please wait bypass',
  'waiting page bypass',
  'skip click to continue',
  'ad shortener continue bypass',
  'link shortener bypass',
  'skip wait extension',
] as const;

const intro =
  'Confirm continue on 1shortlink shows please wait, a progress bar, and a Continue button under ads. Skip Wait clears that waiting page in Chrome, finishes Continue for you, and opens the next link when unlock is allowed.';

const body = `## Confirm Continue on 1shortlink

A shared 1shortlink address often opens Confirm continue instead of the file or article. Please wait stays on screen. A progress bar runs. Continue sits under ads. Leave or refresh too early and the same waiting page returns. That delay is what a 1shortlink continue skip and please wait bypass address.

Some shares open a confirm page first, then the unlock screen. Others open directly on the unlock waiting page. Skip Wait covers both when they are unlock pages, not ordinary site pages without a continue gate.

### What Blocks You

- Confirm continue with please wait before anything opens
- A progress bar that holds attention on the waiting page
- Continue placed under ads
- A password field when the share is locked
- Another shortener after 1shortlink completes Continue

## How Skip Wait Helps

On a matching 1shortlink waiting page, Skip Wait skips the please wait delay, runs the Continue step the site expects, and opens the destination for that share. You stay in Chrome. You do not paste the link into another tool. That is the 1shortlink bypass Skip Wait provides for this site.

Steps:

1. Open the 1shortlink share in Chrome
2. Stay on Confirm continue or the unlock waiting page
3. Let Skip Wait finish Continue and open your link

If a password field is visible, enter the password on the page, then reload. Skip Wait continues after the lock is gone. It cannot supply a password.

## After 1shortlink, Another Gate Is Common

When Continue succeeds, 1shortlink often sends you to another short link, not the final article. Skip Wait’s work on this page ends when that waiting page is cleared. If the next site is also supported, Skip Wait can help on that tab. Finishing Continue correctly once is more reliable than a fake instant skip that fails and returns you to please wait.

If you leave midway, Confirm continue may appear again with the same please wait message.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'What does Skip Wait skip on 1shortlink?',
    answer:
      'Please wait, progress bar delay, and finding Continue under ads on supported Confirm continue and unlock waiting pages, so your link can open when unlock is allowed.',
  },
  {
    question: 'Do I still click Continue myself?',
    answer: 'On supported waiting pages, no. Skip Wait finishes Continue for you.',
  },
  {
    question: 'Why am I on another shortener after 1shortlink?',
    answer:
      'Many shares pass you to another short link after Continue. Skip Wait clears the 1shortlink step; the next site is separate if Skip Wait supports it.',
  },
  {
    question: 'What if I see a password field?',
    answer: 'Enter the password on the page, then reload. Skip Wait continues after the lock is gone.',
  },
  {
    question: 'Do I need to paste the link somewhere else?',
    answer: 'No. Open it in Chrome with Skip Wait enabled and stay on that tab.',
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
