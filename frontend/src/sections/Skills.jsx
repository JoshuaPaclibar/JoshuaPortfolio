import SectionTitle from '../components/SectionTitle.jsx';
import { profile } from '../data/profile.js';

export default function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionTitle id="skills-title" title="Skills" />
        <div className="grid grid--3">
          {profile.skills.map((group) => (
            <article key={group.category} className="skill-group">
              <h3>{group.category}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
