import Image from 'next/image';
import styles from '../ui/UI.module.css';

export function LogoMark({
  compact = false,
  priority = false,
}: {
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={styles.logo}>
      <Image
        src="/ratatoskur-logo.svg"
        alt=""
        width={compact ? 42 : 54}
        height={compact ? 42 : 54}
        preload={priority}
        className={styles.logoImage}
      />
      {!compact && <span className={styles.wordmark}>Ratatoskur</span>}
    </span>
  );
}
