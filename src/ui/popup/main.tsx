import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Section } from '../components/Section';
import { typography } from '../typography';
import { getRequestSupportUrl, CONTACT } from '../constants';
import '../global.css';

const REQUEST_SUPPORT_URL = getRequestSupportUrl();

function getExtensionIconUrl(): string {
  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    return chrome.runtime.getURL('icon.png');
  }
  return '/icon.png';
}

function PopupPage(): React.ReactElement {
  return (
    <div className="flex min-h-[260px] min-w-[320px] max-w-[360px] flex-col bg-neutral-50 font-poppins">
      <Header title="Skip Wait" iconUrl={getExtensionIconUrl()} />
      <main className="flex flex-1 flex-col gap-4 overflow-auto py-4 sm:px-4">
        <section className="rounded-radius-card bg-white px-4 py-4 text-center shadow-sm sm:mx-4 sm:px-6 sm:py-5">
          <div className="mx-auto max-w-xl space-y-3">
            <p className={`${typography.bodySm} text-neutral-700`}>
              On supported link shorteners and file hosts, one click skips the countdown and takes you straight to the link.
            </p>
          </div>
        </section>
        <Section title="Want us to add a website?">
          <p className={`${typography.bodySm} text-neutral-700`}>
            If a website shows a countdown or wait page and we don’t support it yet, tell us the website and what you see. We’ll use that to add support. Post on GitHub or contact us below.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <a
              href={REQUEST_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-radius-button bg-primary-600 px-4 py-2.5 font-poppins text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className="h-4 w-4 shrink-0"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Ask to add a website
            </a>
            <div className="flex items-center justify-center gap-4">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 hover:underline"
                aria-label="Email"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email
              </a>
              <a
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 hover:underline"
                aria-label="Telegram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                  />
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <PopupPage />
    </StrictMode>
  );
}
