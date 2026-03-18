import { typography } from '../typography';

type HeaderProps = {
  title: string;
  iconUrl?: string;
};

export function Header({ title, iconUrl }: HeaderProps): React.ReactElement {
  return (
    <header className="shrink-0 border-b border-primary-200 bg-primary-50 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-center gap-3">
        {iconUrl ? (
          <img src={iconUrl} alt="" className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" width={40} height={40} />
        ) : null}
        <h1 className={`${typography.h1} text-2xl font-black tracking-tight text-primary-800 sm:text-4xl`}>{title}</h1>
      </div>
    </header>
  );
}
