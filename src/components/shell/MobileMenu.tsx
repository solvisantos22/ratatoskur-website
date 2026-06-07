'use client';

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { usePathname } from '@/i18n/navigation';
import styles from './Shell.module.css';

export function MobileMenu({
  children,
  openLabel,
  closeLabel,
}: {
  children: ReactNode;
  openLabel: string;
  closeLabel: string;
}) {
  const panelId = useId();
  const pathname = usePathname();
  const [menuState, setMenuState] = useState({ open: false, pathname });
  const open = menuState.pathname === pathname && menuState.open;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuState({ open: false, pathname });
      triggerRef.current?.focus();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, pathname]);

  function closeAfterNavigation(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest('a, button')) {
      setMenuState({ open: false, pathname });
    }
  }

  return (
    <div className={styles.mobileMenu}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setMenuState({ open: !open, pathname })}
      >
        <span className={styles.menuIcon} data-open={open} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        className={styles.mobilePanel}
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        onClick={closeAfterNavigation}
      >
        {children}
      </div>
    </div>
  );
}
