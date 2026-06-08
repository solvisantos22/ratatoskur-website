import type { DemoMode } from './demo-types';

export type DemoCopy = {
  problem: string;
  interpretedReading: string;
  confidence: string;
  handwritingLines: string[];
  responses: Record<DemoMode, { title: string; body: string; steps?: string[] }>;
};

export const demoCopy: Record<'en' | 'is', DemoCopy> = {
  en: {
    problem: 'Solve the equation: 2x + 3 = 11',
    interpretedReading: '2x + 3 = 11; 2x = 8; x = 4',
    confidence: '68% reading confidence',
    handwritingLines: ['2x + 3 = 11', '2x = 8', 'x = 4'],
    responses: {
      hint: {
        title: 'You are on the right track.',
        body: 'Start by subtracting 3 from both sides so the x-term is alone.',
      },
      check_solution: {
        title: 'The solution is correct.',
        body: 'Each step preserves the equality, and x = 4 satisfies the original equation.',
      },
      reveal: {
        title: 'Full solution',
        body: 'One way to derive the answer is to undo the operations around x in reverse order.',
        steps: [
          'Start with 2x + 3 = 11.',
          'Subtract 3 from both sides: 2x = 8.',
          'Divide both sides by 2: x = 4.',
        ],
      },
    },
  },
  is: {
    problem: 'Leystu jöfnuna: 2x + 3 = 11',
    interpretedReading: '2x + 3 = 11; 2x = 8; x = 4',
    confidence: '68% lestraröryggi',
    handwritingLines: ['2x + 3 = 11', '2x = 8', 'x = 4'],
    responses: {
      hint: {
        title: 'Þú ert á réttri leið.',
        body: 'Byrjaðu á að draga 3 frá báðum megin svo x-liðurinn standi eftir.',
      },
      check_solution: {
        title: 'Lausnin er rétt.',
        body: 'Hvert skref varðveitir jafngildið og x = 4 uppfyllir upphaflegu jöfnuna.',
      },
      reveal: {
        title: 'Full lausn',
        body: 'Ein leið til að leiða svarið út er að vinda ofan af aðgerðunum í kringum x í öfugri röð.',
        steps: [
          'Byrjaðu með 2x + 3 = 11.',
          'Dragðu 3 frá báðum megin: 2x = 8.',
          'Deildu báðum megin með 2: x = 4.',
        ],
      },
    },
  },
};
