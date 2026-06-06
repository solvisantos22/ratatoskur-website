import Image from 'next/image';

export function DeviceFrame({ src, alt, width = 260, ratio = 2 }: { src: string; alt: string; width?: number; ratio?: number }) {
  return (
    <div style={{ width, background: '#1c0e07', borderRadius: 40, padding: 10, boxShadow: '0 30px 60px -24px oklch(0.27 0.05 48 / 0.5)' }}>
      <div style={{ borderRadius: 32, overflow: 'hidden', background: 'var(--surface)' }}>
        <Image src={src} alt={alt} width={width - 20} height={Math.round((width - 20) * ratio)} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    </div>
  );
}
