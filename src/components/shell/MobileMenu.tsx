'use client';

import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { usePathname } from '@/i18n/navigation';
import { nextFocusIndex, PANEL_FOCUSABLE_SELECTOR } from './menu-utils';
import styles from './Shell.module.css';

function getPanelFocusables(panel: HTMLElement) {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(PANEL_FOCUSABLE_SELECTOR),
  ).filter((element) => element.offsetParent !== null);
}

function focusMenuTrigger(trigger: HTMLButtonElement | null) {
  const liveTrigger =
    trigger?.isConnected === true
      ? trigger
      : document.querySelector<HTMLButtonElement>('button[aria-controls]');
  liveTrigger?.focus();
}

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

  const closeMenu = useCallback(
    (restoreFocus: boolean) => {
      if (restoreFocus) {
        focusMenuTrigger(triggerRef.current);
      }

      setMenuState({ open: false, pathname });

      if (restoreFocus) {
        window.requestAnimationFrame(() => focusMenuTrigger(triggerRef.current));
        window.setTimeout(() => focusMenuTrigger(triggerRef.current), 150);
      }
    },
    [pathname],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      const firstFocusable = panelRef.current
        ? getPanelFocusables(panelRef.current)[0]
        : undefined;
      firstFocusable?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = getPanelFocusables(panel);
      if (focusables.length === 0) {
        event.preventDefault();
        focusMenuTrigger(triggerRef.current);
        return;
      }

      const currentIndex = focusables.findIndex(
        (element) => element === document.activeElement,
      );
      if (currentIndex === -1) {
        event.preventDefault();
        focusables[event.shiftKey ? focusables.length - 1 : 0]?.focus();
        return;
      }

      const nextIndex = nextFocusIndex(
        currentIndex,
        focusables.length,
        event.shiftKey ? -1 : 1,
      );

      event.preventDefault();
      focusables[nextIndex]?.focus();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeMenu, open]);

  function closeAfterNavigation(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest('a, button')) {
      closeMenu(true);
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
