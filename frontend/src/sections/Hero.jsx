import SocialLinks from '../components/SocialLinks.jsx';
import { profile } from '../data/profile.js';

export default function Hero() {
  const skills = profile.homeSkills || [];

  return (
    <section id="home" className="hero" aria-labelledby="hero-name">
      <div className="container hero__inner">
        <img className="hero__photo" src={profile.photo} alt={`Portrait of ${profile.name}`} width="180" height="180" />
        <h1 id="hero-name">{profile.name}</h1>
        <p className="hero__intro">{profile.intro}</p>

        {skills.length > 0 && (
          <div className="hero__skills">
            <h2 className="hero__skills-title">My Skills</h2>
            <ul className="chips chips--lg" aria-label="My skills">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects">View My Projects</a>
        </div>

        <SocialLinks className="hero__social" />
      </div>
    </section>
  );
}
