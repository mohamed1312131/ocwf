import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { resolvePhoto } from '../Photo';

export interface RadioOption {
  value: string;
  label: string;
  icon: LucideIcon;
  /** Optional photo id shown as the selection avatar (decorative). */
  photoId?: string;
}

interface RadioCardsProps {
  name: string;
  legend: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Renders the avatar as a full-bleed column (photo) instead of a round icon tile. */
  avatarStyle?: 'icon' | 'photo';
}

/** Accessible radio group rendered as selectable cards. */
export function RadioCards({ name, legend, options, value, onChange, error, avatarStyle = 'icon' }: RadioCardsProps) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-semibold text-text-primary">
        {legend} <span className="text-error"> *</span>
      </legend>
      <div role="radiogroup" aria-labelledby={undefined} aria-label={legend} className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          const photo = opt.photoId ? resolvePhoto(opt.photoId) : null;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring ${
                selected
                  ? 'border-primary bg-[#1FBF9A]/8 shadow-soft'
                  : 'border-border bg-white hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
                aria-invalid={!!error}
              />
              {avatarStyle === 'photo' ? (
                photo ? (
                  <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                    <img src={photo} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" />
                  </span>
                ) : (
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      selected ? 'bg-primary text-white' : 'bg-[#1FBF9A]/15 text-primary-strong'
                    }`}
                  >
                    <opt.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )
              ) : (
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    selected ? 'bg-primary text-white' : 'bg-[#1FBF9A]/15 text-primary-strong'
                  }`}
                >
                  <opt.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <span className="flex flex-1 items-center justify-between">
                <span className="font-semibold text-text-primary">{opt.label}</span>
                {selected ? <Check className="h-5 w-5 text-primary" aria-hidden="true" /> : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}