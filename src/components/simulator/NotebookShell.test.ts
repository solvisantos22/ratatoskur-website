import { describe, expect, it } from 'vitest';

import { getNotebookToolbarItems } from './NotebookShell';

describe('NotebookShell toolbar', () => {
  it('does not include a highlighter tool in the demo notebook chrome', () => {
    expect(getNotebookToolbarItems('en')).toEqual([
      'Pen selected',
      'Eraser',
      'Ruler',
    ]);
    expect(getNotebookToolbarItems('is')).toEqual([
      'Penni valinn',
      'Strokleður',
      'Reglustika',
    ]);
  });
});
