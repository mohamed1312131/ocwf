import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Label + control + inline error/hint wrapper (accessibility first). */
export function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-text-primary">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-input-background px-4 py-3 text-text-primary placeholder:text-text-secondary/70 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    invalid ? 'border-error' : 'border-border'
  }`;