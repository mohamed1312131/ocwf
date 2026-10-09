import { useId } from 'react';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Accessible tablist (ARIA tabs pattern, arrow-key navigation).
 * Tabs render as a segmented control — content switching is the caller's job.
 */
export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  const baseId = useId().replace(/:/g, '');

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      onChange(tabs[next].id);
      document.getElementById(`${baseId}-tab-${tabs[next].id}`)?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Sections de fonctionnalités"
      onKeyDown={onKeyDown}
      className={`inline-flex items-center gap-1 rounded-full bg-mist p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            role="tab"
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selected ? 'bg-white text-primary-strong shadow-soft' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}