import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'Movies4u';

const bypassType = 'Skip Landing Page';

const description =
  'Movies4u bypass skips the Movies4u landing page so Skip Wait opens Latest Releases on the live catalog without tapping it.';

const domains = ['1movies4u.cc'] as const;

const keywords = [
  'movies4u bypass',
  '1movies4u bypass',
  'movies4u landing bypass',
  'movies4u latest releases',
  'movies4u browse full site',
  'skip movies4u landing',
  '1movies4u.cc bypass',
  'movies4u chrome extension',
  'movies4u skip wait',
  'skip wait movies4u',
  'movies4u catalog redirect',
  'movies4u live catalog',
  'skip wait extension',
] as const;

const intro =
  'Movies4u often starts on a marketing landing with How To Download From Us, Browse Full Site, Latest Releases, Bollywood, and K-Drama before the live catalog. Skip Wait is the Chrome extension that opens that landing, skips the extra tap, and takes you straight to Latest Releases.';

const body = `## A landing that sells the brand before the catalog

Shared Movies4u links frequently open a gateway page first: logo, tagline, How To Download From Us copy, and a row of big buttons. Latest Releases is the one that points at the live catalog root. Browse Full Site, Bollywood, K-Drama, and Join Telegram sit beside it, so it is easy to tap the wrong chip or sit reading the long marketing text instead of the movies list.

A movies4u landing bypass is about leaving that gateway—not about a download countdown on a file host.

### What you see before the catalog

- Movies4u branding and the Latest 4K Movies tagline
- **Browse Full Site** as a large premium-style button
- **Latest Releases** in the CTA row
- Bollywood, K-Drama, and Join Telegram as other chips
- A long How To Download From Us article under the buttons

## Skip Wait opens Latest Releases for you

With Skip Wait enabled on the supported Movies4u landing, the page is covered while Skip Wait finds the Latest Releases destination and opens it. Status stays plain: Opening Latest Releases—no need to hunt Browse Full Site or scroll past How To Download From Us.

Bollywood, K-Drama, and Telegram chips are left alone. This Movies4u bypass only advances Latest Releases, matching the free-catalog entry people actually want from the gateway.

## When the live catalog domain changes

Movies4u updates the Latest Releases destination on the landing when mirrors move. Skip Wait follows whatever URL that Latest Releases control currently points to, so you stay on the live catalog instead of memorizing a hostname.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'Which Movies4u page does Skip Wait handle?',
    answer:
      'The supported landing gateway (such as the 1Movies4u landing) that shows Latest Releases before the live catalog. Individual movie download host pages are separate.',
  },
  {
    question: 'Does Skip Wait open Browse Full Site or Bollywood?',
    answer:
      'No. It opens only Latest Releases—the catalog entry control on that landing.',
  },
  {
    question: 'Is there a timer on the Movies4u landing?',
    answer:
      'Not a countdown gate. The friction is the marketing landing and extra buttons before the live catalog. Skip Wait skips that hop.',
  },
  {
    question: 'Will this still work if Movies4u changes the catalog domain?',
    answer:
      'Yes, as long as Latest Releases on the landing points at the new live catalog. Skip Wait follows that link.',
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
