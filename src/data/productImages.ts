import { FinancingCategoryType } from '../types';

// Curated category imagery keeps the catalogue visual while staying tied to each facility.
export const PRODUCT_IMAGES: Record<FinancingCategoryType, { src: string; alt: string }> = {
  personal: {
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
    alt: 'Person reviewing a personal finance card and payment documents',
  },
  vehicle: {
    src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85',
    alt: 'Modern vehicle representing vehicle financing',
  },
  property: {
    src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85',
    alt: 'Modern home representing property financing',
  },
  business: {
    src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
    alt: 'Business team planning growth and working capital',
  },
  equipment: {
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85',
    alt: 'Technician working with industrial equipment',
  },
  trade: {
    src: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=85',
    alt: 'Cargo containers representing trade financing',
  },
  project: {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85',
    alt: 'Construction project representing project financing',
  },
  takaful: {
    src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85',
    alt: 'Family protection documents representing Takaful coverage',
  },
};
