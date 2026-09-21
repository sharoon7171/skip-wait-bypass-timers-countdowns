import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'XFree';

const bypassType = 'Skip Reel Ad Lock';

const description =
  'XFree bypass keeps vertical reels free of forced promo slides and the Skip in timer, with Skip Wait, a Chrome extension for continuous scrolling.';

const domains = ['xfree.com'] as const;

const keywords = [
  'xfree bypass',
  'XFree bypass extension',
  'xfree reel ad bypass',
  'skip reel ad lock',
  'skip in timer bypass',
  'xfree skip in 5 seconds',
  'bypass countdown timer',
  'skip waiting page',
  'tiktok porn shorts ads',
  'skip wait extension',
  'xfree promo slide skip',
] as const;

const intro =
  'On XFree, scrolling a vertical reel eventually drops you onto a promo slide that freezes the feed behind Skip in for several seconds. Skip Wait removes those promo slides from the reel list so you keep moving through real videos without the lock.';

const body = `## Promo slides that freeze the reel

XFree plays like a shorts feed: swipe or arrow down through clips. After enough videos, the site inserts a sponsored promo slide between them. While that promo is active, the feed shows Skip in and blocks the next scroll until the short countdown ends.

You were not waiting for a download link. You were waiting because an ad slide was treated as a locked reel item. That is why people look for an XFree bypass, skip reel ad lock help, or a way past the Skip in timer without sitting through every promo.

### What gets in the way

- Promo and placeholder slides mixed into the reel queue
- Skip in countdowns that disable up and down controls
- Touch and arrow navigation that refuse to change slides while locked
- Repeated ad inserts as you keep browsing the same feed

## Reels without the forced promo stop

Skip Wait watches the XFree feed and keeps the slide list limited to real videos. Promo slides never join the queue, so the Skip in lock has nothing to attach to. If you somehow land on a promo before the fix applies, the extension steps you back onto a normal video and clears the lock.

How to use it:

1. Install Skip Wait in Chrome and open XFree as usual.
2. Start a video or reel feed the way you always do.
3. Scroll through clips. Promo stops and Skip in waits should not appear.
4. Keep watching. Age checks, logins, and site rules outside the reel ad lock still apply on their own.

This is not a paste box or a separate player. You stay on XFree in Chrome while the extension strips the forced promo stops from the feed.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'What does Skip Wait remove on XFree?',
    answer:
      'It removes forced promo slides from the vertical reel feed so the Skip in countdown that locks scrolling does not start.',
  },
  {
    question: 'Will I still see normal videos?',
    answer:
      'Yes. Only the inserted promo and placeholder slides are taken out of the reel list. Regular clips stay in place.',
  },
  {
    question: 'Does this skip every ad on the site?',
    answer:
      'No. Support targets the in-feed promo slide and its Skip in lock. Other page ads, popups, or off-site offers are unchanged.',
  },
  {
    question: 'Do I need to paste a link somewhere?',
    answer:
      'No. Open XFree in Chrome with Skip Wait installed. The extension works on the live reel page.',
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
