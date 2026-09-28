import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'LinksFlys';

const bypassType = 'Skip Short Link';

const description =
  'LinksFlys bypass that skips the partner wait tour and Get Link taps with Skip Wait. This Chrome extension stays on the short URL and unlocks through to your destination.';

const domains = ['blog.linksflys.com', 'linksflys.com'] as const;

const keywords = [
  'linksflys bypass',
  'links flys bypass',
  'blog linksflys bypass',
  'linksflys get link bypass',
  'linksflys timer bypass',
  'your link is almost ready bypass',
  'get link timer bypass',
  'skip waiting page linksflys',
  'skip countdown timer',
  'bypass countdown timer',
  'link shortener bypass',
  'short link bypass',
  'skip wait chrome extension',
] as const;

const intro =
  'A LinksFlys short URL normally pushes you off to partner waiting pages, then asks you to watch Your link is almost ready and tap Get Link, and it may hand you another LinksFlys short URL before the real site. Skip Wait is the bypass for that path: it keeps the tab on LinksFlys, clears the partner wait tour for you, unlocks Get Link without your taps, and continues when another LinksFlys short URL appears until the destination opens.';

const body = `## What You Bypass on LinksFlys

Without Skip Wait, a LinksFlys share is a tour you have to babysit. The short URL leaves for partner waiting pages. You return to Your link is almost ready. You wait, then tap Get Link. Sometimes Get Link only opens another LinksFlys short URL, so the same tour starts again.

A LinksFlys bypass means you skip that manual tour. Skip Wait does the partner path and the Get Link unlock while you stay on the short URL. You are not clicking Continue on partner pages, and you are not pressing Get Link yourself.

## How Skip Wait Unlocks the Short URL

Skip Wait covers the LinksFlys shortener and the LinksFlys blog short-link host used for aliases. When you open a supported short URL, the extension:

- Clears the partner waiting path in the background so you never babysit those pages
- Loads the Get Link surface on the short URL for you
- Unlocks Get Link when the shortener allows it
- Continues automatically if unlock returns another LinksFlys short URL
- Opens the destination once the chain leaves LinksFlys

That is the bypass work. The overlay shows Preparing Get Link, Loading Get Link, Waiting for Get Link, and Getting link so you can see progress without touching the site UI.

### When Another LinksFlys Short URL Appears

Some shares do not stop after the first Get Link. Unlock can return another LinksFlys alias instead of the final site. Skip Wait treats that as the same bypass again: clear the partner path, unlock Get Link, and keep going until the next URL is no longer LinksFlys.

You still get a LinksFlys bypass for every short URL in that chain. You do not restart by hand.

## What Still Needs a Real Hold

LinksFlys can require a short Get Link hold on Your link is almost ready before unlock is accepted. Skip Wait shows that countdown from the page, then unlocks. The bypass is not “sit and open links.” The bypass is skipping the partner tour, the Get Link taps, and the repeat short-URL work. The brief page hold is only what the shortener still enforces before Get Link succeeds.

With Skip Wait installed:

1. Open the LinksFlys short URL in Chrome.
2. Let Skip Wait clear the partner wait path and prepare Get Link.
3. If Your link is almost ready shows a hold, let that short countdown finish.
4. Let Skip Wait unlock Get Link and continue any further LinksFlys short URL.
5. Reach the destination when LinksFlys is done.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'What does a LinksFlys bypass actually skip?',
    answer:
      'The partner waiting tour, tapping Get Link yourself, and repeating that work when unlock returns another LinksFlys short URL. You stay on the short URL while Skip Wait unlocks through.',
  },
  {
    question: 'Is this just waiting for a timer then opening a link?',
    answer:
      'No. Skip Wait clears the partner wait path and unlocks Get Link for you. If another LinksFlys short URL appears, it continues that bypass too. A short page hold may still show when Get Link requires it.',
  },
  {
    question: 'Do I visit every partner waiting page?',
    answer:
      'No. Skip Wait clears that path from the LinksFlys short URL so you do not babysit partner pages or Continue screens.',
  },
  {
    question: 'Why might I see more than one Get Link wait?',
    answer:
      'Some shares unlock into another LinksFlys short URL. Each short URL can have its own Get Link hold. Skip Wait runs the bypass on each one until the destination opens.',
  },
  {
    question: 'Do I still tap Get Link?',
    answer:
      'No. Skip Wait unlocks Get Link for you after any required page hold.',
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
