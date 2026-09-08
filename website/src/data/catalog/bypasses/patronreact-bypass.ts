import type { BypassFaq, SupportedBypass } from '@/types/catalog';

const name = 'PatronReact';

const bypassType = 'Skip Access Key Short Link';

const description =
  'PatronReact bypass clears Obtain Key short-link waits so Skip Wait opens the destination for Paste Key & Unlock.';

const domains = ['patronreact.com'] as const;

const keywords = [
  'patronreact bypass',
  'patronreact access key',
  'patronreact obtain key',
  'patronreact paste key unlock',
  'how to get patronreact access key',
  'patronreact get key',
  'patronreact unlock post',
  'patronreact restricted content',
  'patronreact 7mb bypass',
  'patronreact rinku bypass',
  'obtain key short link bypass',
  'access key short link bypass',
  'skip wait extension',
  'patronreact chrome extension',
] as const;

const intro =
  'PatronReact locks posts behind an access key: This Content is Restricted, Obtain Key, then Paste Key & Unlock. Obtain Key opens a Rinku short link (including 7mb). Skip Wait is the Chrome extension that finishes that short-link hop so you can return and paste the key.';

const body = `## Restricted posts that need an access key

On [PatronReact](https://www.patronreact.com/), a locked post shows **This Content is Restricted** and asks you to provide the necessary access key. The controls are plain: **Obtain Key** to start the key path, and **Paste Key & Unlock** once you have one. Help topics on the site include How to Get an Access Key—the same gate, not a different product.

A patronreact bypass here is not “Skip Wait invents a key on the post.” The sticky part is what **Obtain Key** opens next: a monetized short link on the Rinku network (the hop recorded on 7mb), with Security Check, human check, Next delays, and Please Wait unlock chrome before you ever get back to Paste Key & Unlock.

### What you tap on PatronReact

- **This Content is Restricted** on the locked post
- **Obtain Key** to start getting an access key
- **Paste Key & Unlock** after the short link finishes
- Help center: How to Get an Access Key

## Obtain Key lands on a Rinku short link

PatronReact does not run Skip Wait on its own pages. After **Obtain Key**, you land on a supported Rinku shortener hop—hosts Skip Wait already lists for that network, including 7mb. That tab is where timers and captcha live.

Skip Wait’s path for PatronReact is that short link: keep the extension on the 7mb / Rinku tab. When a human check appears, complete it on the Skip Wait screen. Client-only Next / waiting-page busywork gets cleared; when the shortener still needs a real unlock hold, Skip Wait shows that countdown, then continues so the destination can load and you can bring the access key back to PatronReact.

For Security Check, Please Wait, and unlock-hold detail on that shortener family, use the [Rinku bypass](/sites/rinku-bypass) page. This PatronReact entry is the obtain-key handoff: restricted post → Obtain Key → Rinku/7mb short link → Paste Key & Unlock.

## Back on the post with Paste Key & Unlock

When the short link opens the destination and your access key is ready, return to the locked PatronReact post and use **Paste Key & Unlock**. Skip Wait does not type the key into PatronReact for you and does not unlock Patreon itself—only the short-link wait after Obtain Key.
`;

const faq: readonly BypassFaq[] = [
  {
    question: 'Which PatronReact screen starts this?',
    answer:
      'A locked post with This Content is Restricted, Obtain Key, and Paste Key & Unlock. Obtain Key opens the short link Skip Wait supports.',
  },
  {
    question: 'Does Skip Wait create a PatronReact access key?',
    answer:
      'No. Obtain Key still starts the key path. Skip Wait clears the Rinku/7mb short-link wait you are sent to, then you paste the key on the post.',
  },
  {
    question: 'Where should Skip Wait run?',
    answer:
      'On the short link after Obtain Key (7mb / other listed Rinku hosts). The PatronReact post alone is only Obtain Key and Paste Key & Unlock.',
  },
  {
    question: 'Is this the same as the Rinku catalog page?',
    answer:
      'Related, not the same. This page is the PatronReact Obtain Key → Paste Key & Unlock gate. Rinku has its own page for the short-link stages.',
  },
  {
    question: 'Will I still see a captcha on the short link?',
    answer:
      'Often yes. Human checks stay for you to finish; Skip Wait removes hunting Next and Please Wait busywork around that check.',
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
