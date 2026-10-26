import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface DeckTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface DeckSlideDef extends DeckTab {
  content: ReactNode;
}