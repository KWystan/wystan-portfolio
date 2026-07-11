import cyberImg from '../assets/certificates/introduction_to_cybersecurity.png';
import ccnaSrweImg from '../assets/certificates/ccna_switching_routing_and_wireless_essentials.png';
import dictAideasImg from '../assets/certificates/dict_aideas_top10.jpg';
import ccnaItnImg from '../assets/certificates/ccna_introduction _to_networks.png';
import mangloSnippet1 from '../assets/project_snippets/manglo/1.png';
import mangloSnippet2 from '../assets/project_snippets/manglo/2.png';
import mangloSnippet3 from '../assets/project_snippets/manglo/3.png';
import cictLogo from '../assets/cict.png';
import onhsLogo from '../assets/onhs.png';
import wystanAiSnippet1 from '../assets/project_snippets/wystan-ai/1.png';
import wystanAiSnippet2 from '../assets/project_snippets/wystan-ai/mobile-1.png';
import wystanAiSnippet3 from '../assets/project_snippets/wystan-ai/mobile-2.png';
import triologySnippet1 from '../assets/project_snippets/triology/desktop-1.png';
import triologySnippet2 from '../assets/project_snippets/triology/desktop-2.png';
import triologySnippet3 from '../assets/project_snippets/triology/mobile-1.png';

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
];

export const hero = {
  firstName: 'Karl',
  middleName: 'Wystan',
  lastName: 'Cabalonga',
  title: 'Aspiring Web Developer',
  location: 'Iloilo City, Philippines',
  email: 'karlcabalonga@gmail.com',
  website: 'your-site.dev',
  socials: [
    { name: 'GitHub', url: 'https://github.com/KWystan' },
    { name: 'Facebook', url: 'https://www.facebook.com/stanwy.2024/' },
    { name: 'Instagram', url: '#' },
  ],
};

export const about = [
  'An aspiring Web Developer from the Philippines, focused on building modern and responsive web applications.',
  'Experienced in frontend and backend development, UI design, and networking.',
  'Committed to continuous learning and applying web technologies to solve real-world problems.',
];

export const stack = {
  'Development': ['JavaScript', 'Python', 'HTML', 'CSS', 'React', 'Node.js', 'Express.js', 'Tailwind CSS', 'MongoDB', 'MySQL', 'Firestore', 'XAMPP', 'Vercel', 'Hugging Face', 'Namecheap', 'Android Studio'],
  'Tools & Design': ['Git', 'Docker', 'Figma', 'GitHub', 'Canva', 'Insomnia', 'Sublime Text'],
  'Networking & Systems': ['Cisco', 'Packet Tracer'],
  'Others': ['Setup Computer Server', 'Configure Computer Systems and Networks', 'Install Computer Systems and Networks'],
};

export const stackDetails = {
  'Setup Computer Server': [
    { type: 'text', content: 'During our System Administration and Maintenance course, I learned the fundamentals of setting up and managing computer servers. Our instructor later referred us to take the TESDA NC II Computer Systems Servicing (CSS) assessment since we had already met the qualifications.' },
    { type: 'sep' },
    { type: 'note', content: 'This is part of COC 1 — Set Up Computer Server.' },
    { type: 'heading', content: 'Topics Learned:' },
    { type: 'bullet', content: 'DHCP Server' },
    { type: 'bullet', content: 'DNS Server' },
    { type: 'bullet', content: 'File Services' },
    { type: 'bullet', content: 'Folder Redirection' },
    { type: 'bullet', content: 'Remote Desktop' },
    { type: 'bullet', content: 'Printer Management' },
  ],
  'Configure Computer Systems and Networks': [
    { type: 'text', content: 'During our System Administration and Maintenance course, I learned how to configure computer systems and networks through hands-on laboratory activities. These practical skills are part of the competencies required for the TESDA NC II Computer Systems Servicing (CSS) assessment.' },
    { type: 'sep' },
    { type: 'note', content: 'This is part of COC 2 — Configure Computer Systems and Networks.' },
    { type: 'heading', content: 'Topics Learned:' },
    { type: 'bullet', content: 'Creating Network Cables' },
    { type: 'bullet', content: 'Network Configuration' },
    { type: 'bullet', content: 'Router Configuration' },
    { type: 'bullet', content: 'Wi-Fi Configuration' },
    { type: 'bullet', content: 'Wireless Access Point Configuration' },
    { type: 'bullet', content: 'Repeater Configuration' },
    { type: 'bullet', content: 'Switch Configuration' },
    { type: 'bullet', content: 'Patch Panel Configuration' },
    { type: 'bullet', content: 'Modular Connector Termination' },
    { type: 'bullet', content: 'Inspecting and Testing Configured Computer Networks' },
  ],
  'Install Computer Systems and Networks': [
    { type: 'text', content: 'This section showcases my experience in installing computer systems and preparing them for deployment. These activities were completed during our System Administration and Maintenance course as part of the competencies required for the TESDA NC II Computer Systems Servicing (CSS) assessment.' },
    { type: 'sep' },
    { type: 'note', content: 'This is part of COC 2 — Install Computer Systems and Networks.' },
    { type: 'heading', content: 'Topics Learned:' },
    { type: 'bullet', content: 'Disassembling and Assembling Desktop Computers' },
    { type: 'bullet', content: 'Preparing Installers (Creating Portable Bootable Devices)' },
    { type: 'bullet', content: 'Configuring BIOS' },
    { type: 'bullet', content: 'Installing Windows Server 2008' },
    { type: 'bullet', content: 'Installing Windows Server 2016' },
    { type: 'bullet', content: 'Installing Windows Server 2019' },
    { type: 'bullet', content: 'Installing Windows Server 2022' },
    { type: 'bullet', content: 'Operating System Installation' },
    { type: 'bullet', content: 'Installing Device Drivers' },
  ],
  'Packet Tracer': [
    { type: 'text', content: 'During my Networking 1 & 2 courses in my 1st and 2nd year, I learned how to design and simulate network topologies using Cisco Packet Tracer. This tool helped me understand and apply real-world networking concepts in a controlled environment.' },
    { type: 'sep' },
    { type: 'note', content: 'This is part of the practical activities under networking and system administration training.' },
    { type: 'heading', content: 'What I Learned:' },
    { type: 'bullet', content: 'VLAN & Inter-VLAN Routing' },
    { type: 'bullet', content: 'DHCP & IP Helper Address' },
    { type: 'bullet', content: 'Port Security' },
    { type: 'bullet', content: 'WLANs (Wireless LANs)' },
    { type: 'bullet', content: 'Static & Dynamic Routing' },
    { type: 'bullet', content: 'Subnetting & Network Design' },
    { type: 'bullet', content: 'Creating Network Cables' },
  ],
};

export const experience = [
  {
    company: 'West Visayas State University',
    initials: 'WV',
    role: 'BSIT Student',
    type: 'Student',
    startDate: 'Aug 2023',
    endDate: 'Present',
    duration: '3 yrs',
    description: 'Pursuing a Bachelor of Science in Information Technology at the College of Information and Communications Technology. Building a strong foundation in software development, networking, and systems design.',
    techs: ['Web Design', 'Networking', 'Application Development', 'System Servicing'],
  },
];

export const education = [
  {
    school: 'West Visayas State University — CICT',
    degree: 'Bachelor of Science in Information Technology',
    period: '2023 — 2027',
    location: 'Luna Street, La Paz, Iloilo, Philippines',
    details: [
      'College of Information and Communications Technology',
      'Focus on web development, networking, and practical computing solutions',
    ],
    image: cictLogo,
  },
  {
    school: 'Oton National High School',
    degree: 'Science, Technology, Engineering, and Mathematics (STEM)',
    period: '2017 — 2023',
    location: 'J.P. Laurel Street, Poblacion North, Oton, Iloilo, Philippines',
    details: [
      'Senior High School — Science, Technology, Engineering, and Mathematics Strand',
    ],
    image: onhsLogo,
  },
];

export const projects = [
  {
    title: 'Wystan AI',
    period: '2026',
    description: 'An AI-powered chat app with real-time streaming responses, image and PDF upload support, and text-to-image generation. Features user accounts, conversation history, and project organization — powered by React and a custom API backend.',
    techs: ['React', 'Tailwind CSS', 'Vite', 'Node.js', 'Express.js', 'Supabase'],
    result: 'full-stack AI chat',
    link: '#',
    snippets: [wystanAiSnippet1, wystanAiSnippet2, wystanAiSnippet3],
  },
  {
    title: 'Triology Refreshment',
    period: '2026',
    description: 'A website for a Filipino refreshment shop in Trapiche, Oton, Iloilo, featuring an interactive categorized menu, user sign-in, and a warm green-themed design. Built with React and a Supabase-powered backend for a smooth experience on any device.',
    techs: ['React', 'Tailwind CSS', 'Vite', 'Node.js', 'Express.js', 'Supabase'],
    result: 'restaurant website',
    link: '#',
    snippets: [triologySnippet1, triologySnippet2, triologySnippet3],
  },
  {
    title: 'Manglo.me',
    period: '2026',
    description: 'A free manga, manhwa, and manhua reading platform built mobile-first with a focus on fast loading and seamless reading experience across all devices. Deployed on Vercel with a custom .me domain.',
    techs: ['React', 'Tailwind CSS', 'Vite', 'Node.js', 'Express.js', 'Firebase'],
    result: 'live manga platform',
    link: 'https://www.manglo.me',
    snippets: [mangloSnippet1, mangloSnippet2, mangloSnippet3],
  },
  {
    title: 'Network Configuration Lab',
    period: '2025',
    description: 'Configured and simulated network topologies using Cisco Packet Tracer, implementing VLANs, routing protocols, and subnetting.',
    techs: ['Cisco', 'Packet Tracer', 'VLAN', 'Routing'],
    result: 'practical networking skills',
    link: '#',
  },
  {
    title: 'Web Application Project',
    period: '2025',
    description: 'Developed a full-stack web application as part of academic coursework, featuring user authentication and database integration.',
    techs: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    result: 'functional full-stack app',
    link: '#',
  },
  {
    title: 'System Servicing Workshop',
    period: '2024',
    description: 'Hands-on experience in computer system assembly, troubleshooting, and maintenance as part of IT coursework.',
    techs: ['Hardware', 'Troubleshooting', 'OS Installation'],
    result: 'hands-on servicing skills',
    link: '#',
  },
];

export const certifications = [
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    subtitle: 'WVSU — Cheryll Ann Feliprada',
    initials: 'CS',
    date: '14 Apr 2026',
    link: 'https://www.credly.com/badges/f552074d-e5d0-4b21-8743-106caca5641f',
    linkLabel: 'View on Credly',
    image: cyberImg,
  },
  {
    title: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'Cisco Networking Academy',
    subtitle: 'WVSU — Lea Gabawa',
    initials: 'SR',
    date: '14 Jan 2026',
    link: 'https://www.credly.com/badges/9c61b72a-58c9-48b1-b994-118b01037d7b',
    linkLabel: 'View on Credly',
    image: ccnaSrweImg,
  },
  {
    title: 'AI.DEAS For Impact: AI for Developing Ethical and Applicable Solutions',
    issuer: 'DICT — ICT Industry Development Bureau',
    subtitle: '',
    initials: 'AI',
    date: 'Sep 2025',
    link: null,
    linkLabel: null,
    image: dictAideasImg,
  },
  {
    title: 'CCNA: Introduction to Networks',
    issuer: 'Cisco Networking Academy',
    subtitle: 'WVSU — Lea Gabawa',
    initials: 'CN',
    date: '20 May 2025',
    link: 'https://www.credly.com/badges/5de3e5b9-c232-483d-bb7b-d141e7f56664',
    linkLabel: 'View on Credly',
    image: ccnaItnImg,
  },
];

export const cta = {
  headline: "Let's work together",
  availability: "I'm always open to new opportunities, collaborations, and connecting with fellow developers.",
  email: 'karlcabalonga@gmail.com',
};

export const footer = {
  initials: 'KC',
};
