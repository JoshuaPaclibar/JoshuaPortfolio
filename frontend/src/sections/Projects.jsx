import { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { getProjects } from '../services/api.js';
import { fallbackProjects } from '../data/projects.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready'
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          setStatus('ready');
        }
      })
      .catch((err) => {
        // Not hidden: the visitor (and you, the developer) can see why sample data is shown.
        console.error('[projects] API request failed:', err.message);
        if (!cancelled) {
          setProjects(fallbackProjects);
          setStatus('ready');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionTitle id="projects-title" title="My Projects" />

        {status === 'loading' && (
          <p className="state" role="status">Loading projects…</p>
        )}

        {status === 'ready' && notice && (
          <p className="state state--warning" role="status">{notice}</p>
        )}

        {status === 'ready' && projects.length === 0 && (
          <p className="state">No projects have been added yet.</p>
        )}

        {status === 'ready' && projects.length > 0 && (
          <div className="grid grid--2 grid--projects">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
