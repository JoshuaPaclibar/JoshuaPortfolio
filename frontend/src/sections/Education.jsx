import SectionTitle from '../components/SectionTitle.jsx';
import { isPlaceholder, profile } from '../data/profile.js';

const Value = ({ children }) => (
  <dd className={isPlaceholder(children) ? 'placeholder' : undefined}>{children}</dd>
);

export default function Education() {
  const { degree, school, yearLevel, graduation, coursework, previous } = profile.education;

  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="container">
        <SectionTitle id="education-title" title="Education" />
        <div className="grid grid--2">
          <article className="card">
            <h3>Current</h3>
            <dl className="details">
              <dt>Degree</dt>
              <Value>{degree}</Value>
              <dt>School</dt>
              <Value>{school}</Value>
              <dt>Year level</dt>
              <Value>{yearLevel}</Value>
              <dt>Expected graduation</dt>
              <Value>{graduation}</Value>
              <dt>Relevant coursework</dt>
              <Value>{coursework}</Value>
            </dl>
          </article>
          <article className="card">
            <h3>Previous</h3>
            <dl className="details">
              <dt>School</dt>
              <Value>{previous.school}</Value>
              <dt>Program</dt>
              <Value>{previous.detail}</Value>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
