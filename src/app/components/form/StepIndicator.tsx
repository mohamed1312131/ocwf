import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  current: number;
  onStepClick: (index: number) => void;
  labels: { aria: string };
}

/** Progress indicator for the multi-step access form. */
export function StepIndicator({ steps, current, onStepClick, labels }: StepIndicatorProps) {
  return (
    <ol className="flex items-center" aria-label={labels.aria}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => i < current && onStepClick(i)}
              disabled={i > current}
              aria-current={active ? 'step' : undefined}
              className={`group flex items-center gap-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg ${
                done
                  ? 'cursor-pointer text-primary-strong'
                  : active
                    ? 'text-primary-strong'
                    : 'cursor-not-allowed text-text-secondary'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-colors ${
                  done
                    ? 'border-primary bg-primary text-white'
                    : active
                      ? 'border-primary bg-white text-primary-strong'
                      : 'border-border bg-white text-text-secondary'
                }`}
              >
                {done ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < steps.length - 1 ? (
              <span className={`mx-3 h-0.5 flex-1 rounded ${i < current ? 'bg-primary' : 'bg-border'}`} aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}