import { typography } from '../typography';

const SQ_TECH_URL = 'https://www.sqtech.dev/';

export function Footer(): React.ReactElement {
  return (
    <footer className="mt-auto shrink-0 border-t border-primary-200 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className={typography.caption}>
          Developed by{' '}
          <a
            href={SQ_TECH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 hover:underline"
          >
            SQ Tech
          </a>
        </span>
      </div>
    </footer>
  );
}
