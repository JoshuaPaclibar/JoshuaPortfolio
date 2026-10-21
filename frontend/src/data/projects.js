// FALLBACK SAMPLE DATA.
// The Projects section normally loads projects from the backend (GET /api/projects).
// If the API or database is unavailable, these projects are shown instead, together with a
// visible notice, so the page is still usable while you develop the frontend.
// Keep this list in sync with backend/src/data/projects.js (the seed data).
//
// Only facts from the original design are included. Add your technologies and links yourself.

export const fallbackProjects = [
  {
    _id: 'sample-devify',
    title: 'Devify Development',
    description:
      'A mobile app designed to help users remember assignments, deadlines, and tasks for educational purposes.',
    technologies: [], // [ADD technologies you used]
    image: '/images/devify.png',
    githubUrl: '', // [ADD repository URL]
    liveUrl: '', // [ADD demo URL if available]
  },
  {
    _id: 'sample-cashier',
    title: 'Cashier Programming',
    description: 'A personal Java project from my practice in Java Programming using Eclipse.',
    technologies: ['Java', 'Eclipse'],
    image: '/images/cashier.png',
    githubUrl: '', // [ADD repository URL]
    liveUrl: '',
  },
];
