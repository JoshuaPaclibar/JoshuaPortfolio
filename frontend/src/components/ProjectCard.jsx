import { ExternalLink, Github } from 'lucide-react';
import { isPlaceholder } from '../data/profile.js';

export default function ProjectCard({ project }) {
  const { title, description, technologies = [], image, githubUrl, liveUrl } = project;
  const techs = technologies.filter((t) => t && !isPlaceholder(t));

  return (
    <article className="card project-card">
      {image && <img className="project-card__image" src={image} alt={`${title} screenshot`} loading="lazy" />}
      <h3>{title}</h3>
      <p>{description}</p>

      {techs.length > 0 && (
        <ul className="chips" aria-label="Technologies used">
          {techs.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      {(githubUrl || liveUrl) && (
        <div className="project-card__links">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github size={16} aria-hidden="true" /> Code
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} aria-hidden="true" /> Live demo
            </a>
          )}
        </div>
      )}
    </article>
  );
}
