import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'DevUploads';

const bypassType = 'Direct Download';

const description =
  'DevUploads bypass stays on the file page, skips the partner-blog hop and free-download wait, and puts a Direct Download · Skip Wait button on the overlay with the real CDN link.';

const domains = ['devuploads.com'] as const;

const keywords = [
  'devuploads bypass',
  'devuploads.com bypass',
  'bypass devuploads',
  'devuploads download',
  'how to download from devuploads',
  'devuploads free download',
  'go to free download page',
  'devuploads timer bypass',
  'devuploads skip wait',
  'devuploads direct download',
  'devuploads chrome extension',
  'devuploads apk download',
  'skip generate download link',
  'file host bypass',
  'direct download bypass',
  'download timer skip',
  'skip waiting page',
  'skip countdown timer',
  'bypass countdown timer',
  'skip wait chrome extension',
] as const;

const intro =
  'A DevUploads free download page stalls you with a long hide, then auto-posts Get Download Link to a partner blog before any archive appears. Skip Wait is the Chrome extension that keeps you on that file URL, resolves the CDN link, and shows Direct Download · Skip Wait without the blog hop.';

const body = `## File page that tries to leave for a blog

Open a shared DevUploads link and the host keeps the body hidden for a long beat, then posts Get Download Link to a rotating partner article. That hop is where Scroll Down, Go To Free Download Page, and timer chrome live—not on the file URL you opened.

Miss the buried Download Now, leave early, or trip an ad-blocker warning and you restart the same free-download loop. That is why DevUploads timer bypass and DevUploads direct download searches cluster around APK and archive shares.

### What you actually hit

- A long wait while the file page stays hidden
- Auto post away from the host into a partner blog
- Go To Free Download Page / Generate Download Link style controls after the hop
- Adblock warnings that kick you back to the start

## Staying on the file URL

Skip Wait runs on the DevUploads file page inside Chrome. It stops the auto post to partner blogs, resolves the same direct CDN URL the finished free path would mint, and shows Direct Download · Skip Wait in a full-page overlay.

You stay on the link you opened. Ads and scroll banners stay unreachable under the overlay. Nothing auto-starts—you click when you want the file.

## Why paste tools fail here

Third-party resolvers break when the next partner domain rotates. A DevUploads chrome extension install keys off the live file page, so skip waiting page and download timer skip stay useful without re-pasting URLs every time the blog list changes.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'Where does the Skip Wait button appear?',
    answer:
      'On the DevUploads file page itself—inside the full-page overlay—not after a partner blog hop.',
  },
  {
    question: 'Do I still visit the partner blogs?',
    answer:
      'No. Skip Wait blocks the auto post that leaves the host and unlocks the CDN link while you stay on the file URL.',
  },
  {
    question: 'Does this skip Go To Free Download Page waits?',
    answer:
      'Yes. The extension prepares the direct CDN URL via the host download path and exposes it on the overlay button.',
  },
  {
    question: 'Will the download start by itself?',
    answer:
      'No. Skip Wait only shows a ready Direct Download button. You choose when to click.',
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
