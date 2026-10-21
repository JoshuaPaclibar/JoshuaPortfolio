import { NAV_LINKS } from './Navbar.jsx';
import SocialLinks from './SocialLinks.jsx';
import { profile } from '../data/profile.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <nav aria-label="Footer">
          <ul className="footer__links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks />
      </div>
    </footer>
  );
}
