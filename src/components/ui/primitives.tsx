import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-forest text-white hover:bg-evergreen',
  secondary: 'bg-sand text-evergreen hover:bg-[#ded0b5]',
  outline: 'border border-forest/30 text-forest hover:border-forest hover:bg-forest/5',
  text: 'text-forest hover:bg-forest/5',
};

type ButtonProps = {
  variant?: ButtonVariant;
  className?: string;
} & (
  | { href: string; children: ReactNode; target?: string; rel?: string }
  | ({ href?: undefined } & ComponentProps<'button'>)
);

export function Button(props: ButtonProps) {
  const variant = props.variant ?? 'primary';
  const className = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-offset-4 ${buttonStyles[variant]} ${props.className ?? ''}`;

  if (typeof props.href === 'string') {
    return <Link href={props.href} target={props.target} rel={props.rel} className={className}>{props.children}</Link>;
  }

  const buttonProps = { ...props } as ComponentProps<'button'> & { variant?: ButtonVariant; href?: undefined };
  delete buttonProps.variant;
  delete buttonProps.href;
  buttonProps.className = className;
  return <button {...buttonProps} />;
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--content-width)] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className = '',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-4xl leading-[1.05] text-charcoal sm:text-5xl">{title}</h2>
      {description && <p className="mt-4 max-w-2xl text-base leading-7 text-[#59645d]">{description}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border border-[#deded3] bg-white p-6 ${className}`}>{children}</div>;
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center border border-forest/20 bg-sage/20 px-2.5 py-1 text-xs font-semibold text-forest ${className}`}>{children}</span>;
}

type InputFieldProps = Omit<ComponentProps<'input'>, 'id'> & { id: string; label: string; error?: string; hint?: string };
const fieldClassName = 'mt-1.5 min-h-11 w-full rounded-sm border border-[#c9cec5] bg-white px-3 py-2 text-base text-charcoal placeholder:text-[#7a817b] focus:border-forest focus:outline-none';

function FieldDescription({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) return <p id={`${id}-error`} className="mt-1.5 text-sm text-[#a2352a]">{error}</p>;
  if (hint) return <p id={`${id}-hint`} className="mt-1.5 text-sm text-[#59645d]">{hint}</p>;
  return null;
}

export function FormField({ id, label, error, hint, className = '', ...inputProps }: InputFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-charcoal">{label}</label>
      <input id={id} className={fieldClassName} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...inputProps} />
      <FieldDescription id={id} error={error} hint={hint} />
    </div>
  );
}

type SelectFieldProps = Omit<ComponentProps<'select'>, 'id'> & { id: string; label: string; error?: string; hint?: string; children: ReactNode };

export function SelectField({ id, label, error, hint, className = '', children, ...selectProps }: SelectFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-charcoal">{label}</label>
      <select id={id} className={fieldClassName} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...selectProps}>
        {children}
      </select>
      <FieldDescription id={id} error={error} hint={hint} />
    </div>
  );
}

type TextareaFieldProps = Omit<ComponentProps<'textarea'>, 'id'> & { id: string; label: string; error?: string; hint?: string };

export function TextareaField({ id, label, error, hint, className = '', ...textareaProps }: TextareaFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-charcoal">{label}</label>
      <textarea id={id} className={`${fieldClassName} min-h-32 resize-y`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...textareaProps} />
      <FieldDescription id={id} error={error} hint={hint} />
    </div>
  );
}

export function FormMessage({ children, variant = 'error' }: { children: ReactNode; variant?: 'error' | 'success' | 'info' }) {
  const styles = {
    error: 'border-[#a2352a]/30 bg-[#a2352a]/5 text-[#842b22]',
    success: 'border-forest/25 bg-sage/20 text-evergreen',
    info: 'border-[#deded3] bg-white text-charcoal',
  };
  return <p role={variant === 'error' ? 'alert' : 'status'} className={`border px-4 py-3 text-sm ${styles[variant]}`}>{children}</p>;
}

export function LoadingIndicator({ label = 'Loading' }: { label?: string }) {
  return <span role="status" className="inline-flex items-center gap-2 text-sm text-[#59645d]"><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-forest/20 border-t-forest" />{label}</span>;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse bg-[#e5e6df] ${className}`} />;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="border border-dashed border-[#c9cec5] px-6 py-10 text-center"><h3 className="text-2xl text-charcoal">{title}</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#59645d]">{description}</p></div>;
}