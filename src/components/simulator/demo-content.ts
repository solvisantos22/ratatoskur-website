import type { DemoMode } from './demo-types';

export type DemoCopy = {
  problem: string;
  interpretedReading: string;
  confidence: string;
  handwritingLines: string[];
  responses: Record<DemoMode, { title: string; body: string }>;
};

export const demoCopy: Record<'en' | 'is', DemoCopy> = {
  en: {
    problem: 'Solve the equation: 2x + 3 = 11',
    interpretedReading: '2x + 3 = 11',
    confidence: '68% reading confidence',
    handwritingLines: ['2x + 3 = 11', '2x = 8', 'x = 4'],
    responses: {
      hint: {
        title: 'You are on the right track.',
        body: 'Next, divide both sides by 2 to isolate x.',
      },
      check_solution: {
        title: 'The solution is correct.',
        body: 'Each step preserves the equality, and x = 4 satisfies the original equation.',
      },
      reveal: {
        title: 'Full solution',
        body: 'Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.',
      },
    },
  },
  is: {
    problem: 'Leystu jöfnuna: 2x + 3 = 11',
    interpretedReading: '2x + 3 = 11',
    confidence: '68% lestraröryggi',
    handwritingLines: ['2x + 3 = 11', '2x = 8', 'x = 4'],
    responses: {
      hint: {
        title: 'Þú ert á réttri leið.',
        body: 'Næst skaltu deila báðum megin með 2 til að einangra x.',
      },
      check_solution: {
        title: 'Lausnin er rétt.',
        body: 'Hvert skref varðveitir jafngildið og x = 4 uppfyllir upphaflegu jöfnuna.',
      },
      reveal: {
        title: 'Full lausn',
        body: 'Dragðu 3 frá báðum megin til að fá 2x = 8 og deildu síðan með 2 til að fá x = 4.',
      },
    },
  },
};
