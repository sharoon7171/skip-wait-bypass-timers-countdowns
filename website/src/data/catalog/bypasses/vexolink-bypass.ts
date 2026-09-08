import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'VexoLink';

const bypassType = 'Skip Short Link';

const description =
  'VexoLink bypass clears Please wait, Loading Link Wait seconds, and Get Link holds so Skip Wait opens the destination on the alias.';

const domains = ['vexo-link.com'] as const;

const keywords = [
  'vexolink bypass',
  'vexo link bypass',
  'vexo-link bypass',
  'vexolink timer bypass',
  'vexolink countdown bypass',
  'vexolink get link',
  'vexolink please wait',
  'loading link wait seconds',
  'please wait next',
  'vexolink unlock',
  'skip waiting page vexolink',
  'get link timer bypass',
  'skip countdown timer',
  'bypass countdown timer',
  'link shortener bypass',
  'short link bypass',
  'skip wait chrome extension',
] as const;

const intro =
  'A VexoLink alias tries to yank you into article pages labeled Please wait and Loading Link … Wait N Seconds with Next between them, then back to Please wait… and Get Link on the short URL. Skip Wait is the Chrome extension that never leaves VexoLink for that tour and finishes Get Link when the shortener allows it.';

const body = `## Loading Link is the trap, not the prize

[VexoLink](https://vexo-link.com/) shares open as a short alias, then push hard toward filler articles. Those screens show Please wait, a Loading Link … Wait N Seconds counter, and Next—sometimes stacked so you tap Next more than once before anything useful appears. Leave mid-count, miss a Next, or reload and the same vexolink please wait path starts over from the alias.

That busywork is monetization chrome. The destination you wanted is never on those article cards.

### Screens that show up on a normal run

- The VexoLink alias you opened
- Please wait / Loading Link … Wait N Seconds / Next on the forced articles
- Please wait… with a short timer and a disabled Get Link on the unlock shell
- Get Link once that timer ends

## Unlock without the article clicks

Skip Wait runs on the VexoLink short URL only. It does not open the article tour as tabs and does not ask you to click Next. Status updates while unlock runs—opening the short link, clearing the forced article path, loading Get Link, then holding for the real Get Link timer from that page.

Cosmetic countdown labels are ignored when they are only UI. If Get Link still rejects an early unlock, Skip Wait waits that enforced delay once, finishes Get Link, and opens whatever URL comes back.

## Get Link is unlock, not a file promise

Get Link on VexoLink unlocks the next URL for that alias. It is not a download button. The hop after a vexolink get link finish might be another shortener—often [Linkvertise](/sites/linkvertise-bypass)—or a direct page. Stay on the tab so the matching rule can continue when that brand appears. This catalog page covers the VexoLink stage alone.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'What does a VexoLink bypass clear?',
    answer:
      'The Please wait / Loading Link / Next article tour and the Please wait… Get Link timer, while the tab stays on the VexoLink alias.',
  },
  {
    question: 'Do I still tap Next on the articles?',
    answer:
      'No. Skip Wait never sends you through those article pages. Unlock finishes from the short URL.',
  },
  {
    question: 'Why is there still a countdown before Get Link?',
    answer:
      'VexoLink rejects an early Get Link. Skip Wait reads the timer from that unlock shell, waits that time once, then continues.',
  },
  {
    question: 'What opens after Get Link?',
    answer:
      'Whatever URL VexoLink returns for the alias. If that is Linkvertise or another supported brand, stay on the tab for that next rule.',
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
