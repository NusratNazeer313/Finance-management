import { IconName } from '../components/Icon';

export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
};

/** App onboarding copy (UI content, not financial mock data). */
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'See every dollar clearly',
    description: 'Track income, spending, and savings in one calm, everyday account view.',
    icon: 'wallet',
  },
  {
    id: '2',
    title: 'Budget with intention',
    description: 'Set category limits and get notified before you overspend.',
    icon: 'chart',
  },
  {
    id: '3',
    title: 'Reach savings goals',
    description: 'Create targets and watch real progress toward what matters.',
    icon: 'target',
  },
];
