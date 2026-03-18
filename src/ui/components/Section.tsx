import { typography } from '../typography';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps): React.ReactElement {
  return (
    <section className="rounded-radius-card bg-white px-4 py-4 text-center shadow-sm sm:mx-4 sm:px-6 sm:py-5">
      <h2 className={`${typography.h2} mb-3 text-xl font-bold tracking-tight text-primary-800 sm:text-3xl`}>{title}</h2>
      <div className="mx-auto max-w-xl space-y-3">{children}</div>
    </section>
  );
}
