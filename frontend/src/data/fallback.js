// Shown only when the API is unreachable. Contains nothing beyond what the owner provided.
export const FALLBACK = {
  profile: {
    name: 'Sonu Kumar Napit',
    headline: 'Full Stack Developer',
    intro: 'Full stack and backend developer working with JavaScript, Node.js and microservices.',
    bio: 'JavaScript developer focused on backend systems and microservices, learning DevOps and exploring generative AI.',
    goals: 'Grow into a DevOps and backend engineering role.',
    interests: ['React.js', 'Node.js', 'Express.js', 'JavaScript', 'Microservices', 'REST APIs', 'MongoDB', 'PostgreSQL', 'Linux', 'Docker', 'DevOps', 'Cloud Computing', 'System Design', 'Data Structures and Algorithms', 'Generative AI'],
    image: '',
    socials: [
      { label: 'GitHub', url: 'https://github.com/sonunapit' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sonu-kumar-napit-988a152a1/' },
      { label: 'LeetCode', url: 'https://leetcode.com/u/Sonu_Kumar_napit/' },
      { label: 'HackerRank', url: 'https://www.hackerrank.com/profile/sonu714169' },
    ],
  },
  settings: { defaultMode: 'dark', siteTitle: 'SONU OS' },
  resume: null,
  projects: ['Online Marketplace Microservices', 'CivicVoice', 'TravelBharat'].map((name, i) => ({
    _id: `p${i}`, name, status: 'In progress', description: 'Details for this project are added from the admin dashboard.',
    features: [], techStack: [], screenshots: [], githubUrl: 'https://github.com/sonunapit',
  })),
  skills: [
    ['Frontend', ['React.js', 'JavaScript (ES6+)']], ['Backend', ['Node.js', 'Express.js', 'REST APIs', 'Microservices']],
    ['Databases', ['MongoDB', 'PostgreSQL']], ['DevOps', ['Linux', 'Docker']], ['Cloud', ['Cloud Computing']],
    ['AI and GenAI', ['Generative AI']], ['Computer science', ['System Design', 'Data Structures and Algorithms']],
  ].flatMap(([category, names]) => names.map((name) => ({ _id: `${category}-${name}`, name, category }))),
  education: [], experience: [], gallery: [],
};
