import SectionTitle from '../components/SectionTitle.jsx';
import { profile } from '../data/profile.js';

// Three boxes: Background, Experiences, Education. Content comes from data/profile.js.
function Box({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <article className="about-box">
      <h3>{title}</h3>
      <div className="card">
        <ul>
          {items.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function About() {
  const { background, experience, education } = profile.about;

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionTitle id="about-title" title="About Me" />
        <div className="grid grid--3">
          <Box title="Background" items={background} />
          <Box title="Experiences" items={experience} />
          <Box title="Education" items={education} />
        </div>
      </div>
    </section>
  );
}
