import SectionTitle from '../components/SectionTitle.jsx';
import { isPlaceholder, profile } from '../data/profile.js';

const renderItem = (text) => (
  <li key={text} className={isPlaceholder(text) ? 'placeholder' : undefined}>
    {text}
  </li>
);

export default function About() {
  const { background, experience, goals } = profile.about;
  const visibleGoals = goals.filter(Boolean);

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionTitle id="about-title" title="About" />
        <div className="grid grid--3">
          <article className="card">
            <h3>Background</h3>
            <ul>{background.map(renderItem)}</ul>
          </article>
          <article className="card">
            <h3>Experiences</h3>
            <p>{experience}</p>
          </article>
          {visibleGoals.length > 0 && (
            <article className="card">
              <h3>Interests &amp; Goals</h3>
              <ul>{visibleGoals.map(renderItem)}</ul>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
