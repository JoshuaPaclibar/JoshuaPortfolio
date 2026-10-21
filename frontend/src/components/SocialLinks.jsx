import { Github, Linkedin } from 'lucide-react';
import { profile } from '../data/profile.js';

// Renders only the social links that have a URL in data/profile.js.
export default function SocialLinks({ className = '' }) {
  const { github, linkedin } = profile.social;
  if (!github && !linkedin) return null;

  return (
    <ul className={`social-links ${className}`} aria-label="Social links">
      {github && (
        <li>
          <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <Github size={20} aria-hidden="true" />
          </a>
        </li>
      )}
      {linkedin && (
        <li>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <Linkedin size={20} aria-hidden="true" />
          </a>
        </li>
      )}
    </ul>
  );
}
