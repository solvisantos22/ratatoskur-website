import Image from 'next/image';
import styles from '../ui/UI.module.css';

export function LogoMark({
  compact = false,
  priority = false,
}: {
  compact?: boolean;
  priority?: boolean;
}) {
  const size = compact ? 42 : 54;

  return (
    <span className={styles.logo}>
      <Image
        src="/ratatoskur-logo.svg"
        alt=""
        width={size}
        height={size}
        preload={priority}
        className={styles.logoImage}
        style={{ width: size, height: size }}
      />
      {!compact && <span className={styles.wordmark}>Ratatoskur</span>}
    </span>
  );
}
