import { Plus } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Number of panels allowed open at once. */
  type?: 'single' | 'multiple';
  headingLevel?: 2 | 3;
  className?: string;
}

/**
 * Accessible animated accordion styled as clean hairline rows. Each button is a
 * heading with a toggle; the plus icon rotates to a minus and panels expand
 * with a smooth height animation. Reduced-motion is respected.
 */
export function Accordion({ items, type = 'single', headingLevel = 3, className = '' }: AccordionProps) {
  const baseId = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string[]>(type === 'single' ? [items[0]?.id].filter(Boolean) : []);
  const Heading = `h${headingLevel}` as 'h3';

  const toggle = (id: string) => {
    setOpen((prev) =>
      type === 'single'
        ? prev.includes(id)
          ? []
          : [id]
        : prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id],
    );
  };

  return (
    <div className={`divide-y divide-primary/20 ${className}`}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;
        return (
          <div key={item.id}>
            <Heading>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-text-primary transition-colors hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-xl"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'rotate-45 border-[#1FBF9A] bg-[#1FBF9A] text-white'
                      : 'border-border border-[#1FBF9A]/30 text-primary-strong group-hover:bg-[#1FBF9A]/10'
                  }`}
                >
                  <Plus className="h-5 w-5" />
                </span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0.001 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 text-base leading-relaxed text-text-secondary sm:text-lg">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}