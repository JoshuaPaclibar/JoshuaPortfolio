export default function SectionTitle({ id, title, subtitle }) {
  return (
    <header className="section-title">
      <h2 id={id}>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
