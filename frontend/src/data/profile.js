// ───────────────────────────────────────────────────────────────────────────
// Your personal content lives here. Edit this file to update the portfolio.
// Anything written like "[ADD ...]" is a placeholder: replace it with real details,
// or leave it empty ('') to hide it. Only add facts you can back up.
// ───────────────────────────────────────────────────────────────────────────

export const isPlaceholder = (value) => typeof value === 'string' && value.startsWith('[ADD');

export const profile = {
  name: 'Joshua Paclibar',
  role: '3rd-Year Information Technology Student',
  school: 'Western Institute of Technology',
  photo: '/images/profile.png', // replace public/images/profile.png with a higher-resolution photo
  intro:
    'Welcome to my portfolio, my name is Joshua Paclibar. A 3rd year in Bachelor of Science in Information Technology willing to learn web development and programming.',

  // Skills shown on the Home page (chips)
  homeSkills: ['HTML', 'CSS', 'Figma', 'Java'],

  // Social links: paste full URLs. Empty ('') hides the icon.
  social: {
    github: '', // [ADD your GitHub profile URL]
    linkedin: '', // [ADD your LinkedIn profile URL]
  },

  about: {
    // Three boxes on the About page: Background, Experiences, Education (one bullet per entry)
    background: [
      'I was born in St. Pauls Hospital in May 27, 2003.',
      'My hobbies are playing games, watching Anime, and reading Manga (Japanese Comics).',
      'My dream is to have a uneventful stable life.',
      'Currently pursuing a degree of Information Technology to learn System Development.',
    ],
    experience: [
      'So far my experience in IT is not smooth, especially in previous semester in my 1st year in BSIT. Our courses in this program is great because it\u2019s mostly easy to understand and I experienced great teamwork for projects much better than previous level. Overall, it\u2019s a good experience for developing programming skills and interacting with other people as a IT student.',
    ],
    education: [
      'I graduated in RG Hechanova Memorial National High School in my Senior Highschool as HUMSS.',
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
    emailUrl: 'https://mail.google.com/mail/u/0/#inbox?compose=DmwnWrRspxWvsKGtgsrMjLXXDtCLNdPxGLgWLWdpkwFSBHjZVLctNTcFmDcWplFlwsgvQHVZNxcB',
    facebookName: 'Joshua Paclibar',
    facebookUrl: 'https://www.facebook.com/joshua.paclibar.871770',
    phone: '0939 981 8121',
    phoneNote: 'TNT',
  },
};
