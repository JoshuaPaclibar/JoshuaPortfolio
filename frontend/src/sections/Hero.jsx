import SocialLinks from '../components/SocialLinks.jsx';
import { profile } from '../data/profile.js';

export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-name">
      <div className="container hero__inner">
        <img className="hero__photo" src={profile.photo} alt={`Portrait of ${profile.name}`} width="208" height="208" />
        <h1 id="hero-name">{profile.name}</h1>
        <p className="hero__role">{profile.role}</p>
        <p className="hero__school">{profile.school}</p>
        <p className="hero__intro">{profile.intro}</p>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects">View My Projects</a>
          <a className="btn btn--outline" href="#contact">Contact Me</a>
        </div>

        <SocialLinks className="hero__social" />
      </div>
    </section>
  );
}
