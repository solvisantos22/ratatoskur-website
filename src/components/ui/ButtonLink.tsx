import type { ComponentProps } from 'react';
import styles from './UI.module.css';

type Props = ComponentProps<'a'> & {
  tone?: 'espresso' | 'orange' | 'quiet';
};

export function ButtonLink({ tone = 'espresso', className, ...props }: Props) {
  return (
    <a
      {...props}
      className={[styles.button, styles[tone], className].filter(Boolean).join(' ')}
    />
  );
}
