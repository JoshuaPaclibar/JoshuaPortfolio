// ───────────────────────────────────────────────────────────────────────────
// Your personal content lives here. Edit this file to update the portfolio.
// Anything written like "[ADD ...]" is a placeholder: replace it with real details,
// or leave it empty ('') to hide it. Only add facts you can back up.
// ───────────────────────────────────────────────────────────────────────────

export const isPlaceholder = (value) => typeof value === 'string' && value.startsWith('[ADD');

export const profile = {
  name: 'Joshua Y. Paclibar',
  role: '3rd-Year Information Technology Student',
  school: 'Western Institute of Technology',
  photo: '/images/profile.png', // replace public/images/profile.png with a higher-resolution photo
  intro:
    'IT student at Western Institute of Technology, currently pursuing a degree in Information Technology to learn System Development.',

  // Social links: paste full URLs. Empty ('') hides the icon.
  social: {
    github: '', // [ADD your GitHub profile URL]
    linkedin: '', // [ADD your LinkedIn profile URL]
  },

  about: {
    background: [
      'My hobbies are playing games, watching Anime, and reading Manga (Japanese Comics).',
      'My dream is to have an uneventful, stable life.',
      'Currently pursuing a degree of Information Technology to learn System Development.',
    ],
    experience:
      'So far my experience in IT has not been smooth, especially in my previous semester in my 1st year in BSIT. Still, the courses in this program are great because they are mostly easy to understand, and I experienced much better teamwork on projects than at the previous level. Overall, it has been a good experience for developing programming skills and interacting with other people as an IT student.',
    goals: [
      'My current interest are game development and beta tester',
      'My current career goals as a IT student is to learn as much as I can during college. and my next goal is learn game development.',
    ],
  },

  education: {
    degree: 'Bachelor of Science in Information Technology (BSIT)',
    school: 'Western Institute of Technology',
    yearLevel: 'Third Year',
    graduation: '2027-2028 or 2028-2029',
    coursework: [ 'Networking 2, ',
                  'Cybersecurity 1, ',
                  'Artificial Intelligence'],
    previous: {
      school: 'RG Hechanova Memorial National High School',
      detail: 'Senior High School, HUMSS strand',
    },
  },

  // Only list skills you can honestly demonstrate.
  skills: [
    {
      category: 'Software and Programming',
      items: ['Design: Figma', 'Web: HTML, CSS', 'Programming: Java'],
    },
    {
      category: 'Graphic Designing',
      items: ['Print & Editing', 'Brand Design'],
    },
    {
      category: 'Visual Designing',
      items: ['UI Design', 'Background Design'],
    },
  ],

  contact: {
    email: 'joshuapaclibar37@gmail.com',
    facebookName: 'Joshua Paclibar',
    facebookUrl: '', // [ADD your Facebook profile URL to make the name a link]
    phone: '0938 981 8121',
    phoneNote: 'TNT',
  },
};
