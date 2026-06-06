import Image from 'next/image';

export function LogoMark({ size = 28, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <Image src="/ratatoskur-logo.svg" alt="Ratatoskur" width={size} height={size} priority />
      {withWordmark && (
        <span style={{ fontFamily: 'var(--font-display-stack)', fontWeight: 600, fontSize: size * 0.62, color: 'var(--ink)' }}>
          Ratatoskur
        </span>
      )}
    </span>
  );
}
