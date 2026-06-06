export function SectionHeading({ id, title, lead }: { id?: string; title: string; lead?: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: 90, maxWidth: '38ch', marginBottom: 28 }}>
      <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.1, margin: 0 }}>{title}</h2>
      {lead && <p style={{ color: 'var(--ink-2)', marginTop: 12, fontSize: '1.05rem' }}>{lead}</p>}
    </div>
  );
}
