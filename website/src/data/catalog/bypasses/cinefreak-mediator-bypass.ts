import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'Cinefreak Mediator';

const bypassType = 'Skip Waiting Page';

const description =
  'Skip Wait, a Chrome extension that clears Cinefreak generate-page timers and verify clicks so the movie file host opens without the waiting-page ritual.';

const domains = [
  'cinefreak.net',
  'cinefreak.top',
  'cinefreak.tv',
  'cinefreak.ch',
  'cinefreak.ca',
] as const;

const keywords = [
  'cinefreak bypass',
  'cinefreak mediator bypass',
  'cinefreak timer bypass',
  'cinefreak adblock bypass',
  'cinefreak download bypass',
  'cinefreak generate page bypass',
  'skip waiting page',
  'skip countdown timer',
  'bypass countdown timer',
  'please wait bypass',
  'waiting page bypass',
  'verify download bypass',
  'skip wait extension',
] as const;

const intro =
  'Cinefreak shares often open a Securing Your Connection generate page: a short countdown, an adblock warning, and two verify clicks before the file host. Skip Wait takes the unlock path already present on that page and opens the download destination so you are not stuck repeating the timer and verify loop.';

const body = `## What the generate page adds

Movie links from Cinefreak do not land on the file host first. They load generate.php, which runs a visible security countdown, may show a blocker warning, and only then reveals Verify Download. A second Get Download Link click is required after that. Social popups can appear between those steps.

The wait is intentional. Closing the tab early or failing the adblock check sends you back through the same countdown and buttons.

### What you see before the file host

- A five-second countdown with rotating status text
- An adblock, Brave Shields, Private DNS, or VPN warning that hides the download button
- Verify Download as the first click
- Get Download Link as the second click
- Occasional Facebook or Telegram popups between steps

## How Skip Wait clears that gate

On supported Cinefreak generate pages, Skip Wait reads the unlock destination the page already embeds for the final click, then opens it. That path sends you through to the file host without sitting through the countdown, dismissing blocker warnings, or pressing verify twice.

You stay in Chrome. There is no separate paste box and no need to disable your adblocker just to reveal the on-page button.

## Same flow on mirror domains

When the main Cinefreak site is down, mirrors use the same generate.php layout: countdown, blocker check, and two-step verify. Skip Wait follows that shared pattern on every listed domain, so a mirror swap does not mean a new manual routine.

1. Open the Cinefreak generate link on a supported domain.
2. Skip Wait detects the generate page and takes the unlock destination from the page.
3. The file host loads so you can start the download.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'What does the Cinefreak mediator bypass skip?',
    answer:
      'The generate-page countdown, the adblock or network warning screen, and the two verify clicks before the file host opens.',
  },
  {
    question: 'Do I need to turn off my adblocker on Cinefreak?',
    answer:
      'On supported generate pages, no. Skip Wait uses the unlock path already on the page, so the on-page adblock check does not block you.',
  },
  {
    question: 'Do I still need to click Verify Download?',
    answer:
      'On supported pages, no. Skip Wait completes the mediator step so you are not pressing verify and get-download-link for each file.',
  },
  {
    question: 'Will this work if Cinefreak sends me to a mirror?',
    answer:
      'Yes when the mirror is on the supported list and still uses the same generate.php waiting page. Domains outside that list are not covered until they are added.',
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
