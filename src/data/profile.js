// All site copy and links, taken from Shivendra's résumé and public profiles.

export const profile = {
  name: "Shivendra Vishwakarma",
  shortName: "Shivendra",
  heroWord: "SHIVENDRA",
  logo: { first: "S", rest: "V" },
  email: "vshivendra1999@gmail.com",
  phone: "+91 7985311660",
  location: "Delhi NCR, India",
  availability: "Open to opportunities",
  resume: "/Shivendra_Resume.pdf",
};

export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/ShivendraVishwakarma",
    icon: "https://cdn.simpleicons.org/github/ffffff",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shivendravishwakarma/",
    icon: "/icons/linkedin.svg",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/Shivendra22/",
    icon: "https://cdn.simpleicons.org/leetcode/ffffff",
  },
  {
    label: "CodeChef",
    href: "https://www.codechef.com/users/shiven22",
    icon: "https://cdn.simpleicons.org/codechef/ffffff",
  },
];

export const hero = {
  eyebrow: "Building Responsive Web Apps.",
  tagline: "MCA Student · React Developer · Interface Builder",
  description:
    "MCA student and Frontend (React) Intern at ConsultIT Technologies, building scalable, responsive web applications with React.js, Node.js, Express.js and MongoDB.",
};

export const philosophy = {
  label: "The Philosophy",
  title: "The Philosophy",
  hint: "Scroll to expand",
  image: "/images/philosophy-bg.jpg",
  imageAlt: "Atmospheric dark cinematic background",
  statement:
    "I believe great interfaces are built one reusable component at a time — responsive on every screen, clean in architecture, and continuously improving with every problem I solve.",
};

export const projectsIntro = {
  title: "SELECTED PROJECTS",
  subtitle: "FROM API MONITORING DASHBOARDS TO PREMIUM INTERIOR WEBSITES — BUILT RESPONSIVE, REUSABLE, AND USER-FIRST.",
};

export const projects = [
  {
    title: "API Health Checker",
    description:
      "Full-stack API monitoring platform with a React dashboard tracking 20+ endpoints — availability, HTTP status and response time — backed by a Node.js and Express.js health-check service, so failed or slow endpoints surface in one place.",
    image: "/projects/api-health-checker.jpg",
    tags: ["REACT", "NODE.JS", "EXPRESS", "MONGODB", "TAILWIND"],
    githubUrl: "https://github.com/ShivendraVishwakarma",
  },
  {
    title: "Woody — Interior Design",
    description:
      "Premium, responsive interior-design website with 8+ dedicated sections and multi-page navigation across projects, services, team, testimonials, blog and consultation, built from reusable React components.",
    image: "/projects/woody.jpg",
    tags: ["REACT", "VITE", "REACT ROUTER", "CSS"],
    githubUrl: "https://github.com/ShivendraVishwakarma/woody-react",
    liveUrl: "https://woody-react.vercel.app",
  },
  {
    title: "Destination Wedding India",
    description:
      "Luxury wedding-planning site with Indian hospitality at the centre, structured like a modern planning startup: data-friendly content, scalable frontend code and a human-first planning experience.",
    image: "/projects/destination-wedding.jpg",
    tags: ["REACT", "JAVASCRIPT", "RESPONSIVE UI"],
    githubUrl: "https://github.com/ShivendraVishwakarma/Desination-wedding",
  },
  {
    title: "Wanderer — Travel Website",
    description:
      "Modern responsive travel website with destination search, a gallery and a dark mode toggle, written in plain HTML, CSS and JavaScript.",
    image: "/projects/wanderer.jpg",
    tags: ["HTML", "CSS", "JAVASCRIPT"],
    githubUrl: "https://github.com/ShivendraVishwakarma/wanderer-travel-website",
  },
];

export const skillsIntro = {
  label: "Skills & Profiles",
  title: "Code & Craft",
  subtitle: "The stack I build with, and the problems I solve to stay sharp.",
};

export const skills = [
  { group: "Languages", items: ["C++", "JavaScript", "SQL", "Python", "Java"] },
  { group: "Frameworks & Libraries", items: ["React.js", "Node.js", "Express.js", "Tailwind CSS", "Bootstrap"] },
  { group: "Databases", items: ["MySQL", "MongoDB"] },
  { group: "Tools", items: ["Git", "GitHub", "VS Code", "Postman"] },
  { group: "Cloud", items: ["AWS EC2", "Lambda", "S3", "Redshift", "CloudFront", "IAM"] },
  { group: "Concepts", items: ["DBMS", "OOP", "Clean Architecture"] },
];

export const skillDescriptions = {
  "C++": "A compiled language for building fast, efficient software.",
  JavaScript: "The language that brings interactivity to web pages and apps.",
  SQL: "A language for querying and managing relational databases.",
  Python: "A readable, general-purpose language used across many fields.",
  Java: "An object-oriented language used for applications across platforms.",
  "React.js": "Builds user interfaces from reusable components.",
  "Node.js": "Runs JavaScript outside the browser, including on servers.",
  "Express.js": "A lightweight framework for building Node.js web servers and APIs.",
  "Tailwind CSS": "Styles interfaces with small, composable utility classes.",
  Bootstrap: "A UI toolkit with responsive layouts and ready-made components.",
  MySQL: "A relational database for storing data in structured tables.",
  MongoDB: "A document database that stores data in flexible JSON-like records.",
  Git: "Tracks code changes and helps manage versions of a project.",
  GitHub: "Hosts Git repositories for sharing and collaborating on code.",
  "VS Code": "A code editor with tools for writing and debugging software.",
  Postman: "Helps create, send, and inspect API requests.",
  "AWS EC2": "Provides virtual servers for running applications in the cloud.",
  Lambda: "Runs code on demand without managing servers.",
  S3: "Stores and retrieves files as scalable cloud objects.",
  Redshift: "A cloud data warehouse for analyzing large datasets with SQL.",
  CloudFront: "Delivers websites and files quickly through a global edge network.",
  IAM: "Controls access to AWS users, services, and resources.",
  DBMS: "Software for organizing, querying, and maintaining databases.",
  OOP: "Organizes software around objects that combine data and behavior.",
  "Clean Architecture": "Structures software so core logic stays independent of tools.",
};

// Solved-question counts captured from the public profiles
export const codingProfiles = {
  updated: "Oct 2026",
  leetcode: {
    handle: "Shivendra22",
    href: "https://leetcode.com/u/Shivendra22/",
    solved: 130,
    breakdown: [
      { label: "Easy", solved: 85, total: 972, color: "#00b8a3" },
      { label: "Medium", solved: 38, total: 2130, color: "#ffc01e" },
      { label: "Hard", solved: 7, total: 984, color: "#ef4743" },
    ],
  },
  codechef: {
    handle: "shiven22",
    href: "https://www.codechef.com/users/shiven22",
    solved: 263,
  },
  github: {
    handle: "ShivendraVishwakarma",
    href: "https://github.com/ShivendraVishwakarma",
    repos: 13,
  },
};

export const experienceIntro = {
  label: "Experience",
  title: "Where I've Been",
  subtitle: "My professional and academic journey so far.",
};

const experienceAndCertifications = [
  {
    period: "Feb 2026 — May 2026",
    company: "ConsultIT Technologies · Greater Noida",
    role: "Frontend (React) Intern",
    summary:
      "Built the frontend of the Shine Home Interiors project, working directly with the project lead to ship responsive, maintainable UI.",
    points: [
      "Engineered 15+ responsive ReactJS components with consistent UI across devices",
      "Built 8+ reusable UI components with layouts for mobile, tablet and desktop",
      "Delivered 10+ frontend improvements end-to-end within deadlines",
    ],
  },
  {
    period: "2025 — Present",
    company: "ABES Engineering College",
    role: "Master of Computer Applications",
    summary: "Postgraduate study in computer applications with a focus on software development.",
    points: ["Core coursework in DBMS, OOP and software engineering", "Building full-stack projects alongside studies"],
  },
  {
    period: "2019 — 2022",
    company: "Bundelkhand University",
    role: "Bachelor of Arts (B.A.)",
    summary: "Undergraduate degree, followed by a move into computer applications and web development.",
    points: ["Class 12th — S R Inter College (2018 — 2019)", "Class 10th — S R Inter College (2016 — 2017)"],
  },
  {
    period: "Certifications",
    company: "HackerRank · Udemy · Cisco",
    role: "Continuous Learning",
    summary: "Courses and certifications that shaped my full-stack skill set.",
    points: [
      "Frontend Developer (React) — HackerRank (2026)",
      "The Complete Full-Stack Web Development Bootcamp — Udemy (62 hours)",
      "JavaScript for Freshers 2026 — Udemy (11.5 hours)",
      "Python Essentials 1 — Cisco Networking Academy",
    ],
  },
];

const schoolTimelineEntries = [
  {
    period: "2018 â€” 2019",
    company: "S R Inter College",
    role: "Class 12th",
    summary: "Completed higher secondary education.",
    points: [],
  },
  {
    period: "2016 â€” 2017",
    company: "S R Inter College",
    role: "Class 10th",
    summary: "Completed secondary education.",
    points: [],
  },
];

const timelineEntries = experienceAndCertifications.flatMap((item) => item.role === "Bachelor of Arts (B.A.)"
  ? [{ ...item, points: [] }, ...schoolTimelineEntries]
  : [item]);
const certificationEntry = experienceAndCertifications.find((item) => item.role === "Continuous Learning");
export const experience = timelineEntries.filter((item) => item.role !== "Continuous Learning");
export const certificationsIntro = {
  label: "Certifications",
  title: "Learning in Practice",
  subtitle: "Courses and credentials that support my work across frontend and full-stack development.",
};
export const certifications = certificationEntry.points.map((credential) => ({ credential }));
export const featuredAchievement = {
  event: "HackerRank Orchestrate",
  edition: "August 2026",
  achievement: "Built and deployed an AI agent",
  rank: 274,
  participants: 1983,
};

export const contactIntro = {
  label: "Get in Touch",
  title: "Let's Create Something Extraordinary",
  subtitle: "Have a project, internship or role in mind? Send a message and let's talk.",
};

export const menuItems = [
  { label: "Projects", ariaLabel: "Go to Projects section", link: "#projects" },
  { label: "Skills", ariaLabel: "Go to Skills and coding profiles", link: "#skills" },
  { label: "Experience", ariaLabel: "Go to Experience section", link: "#experience" },
  { label: "Certifications", ariaLabel: "Go to Certifications section", link: "#certifications" },
  { label: "Contact", ariaLabel: "Go to Contact section", link: "#contact" },
];
