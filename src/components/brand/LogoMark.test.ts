import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LogoMark } from './LogoMark';

describe('LogoMark', () => {
  it('locks compact logo dimensions against intrinsic SVG sizing', () => {
    const markup = renderToStaticMarkup(createElement(LogoMark, { compact: true }));

    expect(markup).toMatch(/style="[^"]*width:54px;height:54px/);
  });

  it('locks full logo dimensions against intrinsic SVG sizing', () => {
    const markup = renderToStaticMarkup(createElement(LogoMark));

    expect(markup).toMatch(/style="[^"]*width:66px;height:66px/);
  });
});
