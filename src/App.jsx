import { useState, useEffect, useRef } from "react";
import profilePic from "./assets/profile.jpg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050a0e;
    --surface: #0c1419;
    --surface2: #111d24;
    --border: #1a2e38;
    --accent: #00d4aa;
    --accent2: #0099ff;
    --accent3: #ff6b35;
    --text: #e8f4f8;
    --text-muted: #6a8a96;
    --text-dim: #3d5a66;
    --glow: 0 0 40px rgba(0, 212, 170, 0.15);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  ::selection { background: rgba(0,212,170,0.3); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  .cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
  }
  .cursor-dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s;
  }
  .cursor-ring {
    width: 36px; height: 36px;
    border: 1px solid rgba(0,212,170,0.5);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.15s, width 0.2s, height 0.2s;
  }
  .cursor-ring.hover { width: 56px; height: 56px; border-color: var(--accent); }

  /* GRID BACKGROUND */
  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .grid-bg::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,153,255,0.06) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,212,170,0.04) 0%, transparent 60%);
  }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 60px;
    background: rgba(5,10,14,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 3px;
    color: var(--accent);
    text-shadow: 0 0 20px rgba(0,212,170,0.4);
  }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 1.5px;
    color: var(--text-muted);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
    position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0; height: 1px; background: var(--accent);
    transition: width 0.3s;
  }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a:hover::after { width: 100%; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 60px 80px;
    position: relative; z-index: 1;
  }
  .hero-inner {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 80px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  .hero-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 3px;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .hero-tag::before {
    content: ''; width: 40px; height: 1px; background: var(--accent);
  }
  .hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 8vw, 110px);
    line-height: 0.9;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #e8f4f8 0%, #00d4aa 50%, #0099ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 24px;
  }
  .hero-role {
    font-size: 18px;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.5px;
    margin-bottom: 40px;
    line-height: 1.6;
  }
  .hero-role span { color: var(--text); font-weight: 500; }
  .hero-cta {
    display: flex; gap: 16px; flex-wrap: wrap;
  }
  .btn {
    padding: 14px 32px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    letter-spacing: 1px;
    border-radius: 2px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.25s;
  }
  .btn-primary {
    background: var(--accent);
    color: var(--bg);
    border: none;
    font-weight: 500;
  }
  .btn-primary:hover {
    background: #00f0c0;
    box-shadow: 0 0 30px rgba(0,212,170,0.4);
    transform: translateY(-2px);
  }
  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-outline:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-2px);
  }

  /* PROFILE PICTURE */
  .hero-photo-wrap {
    position: relative;
    display: flex; justify-content: center;
  }
  .photo-frame {
    position: relative;
    width: 340px; height: 400px;
    border-radius: 4px;
  }
  .photo-frame::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
    border-radius: 4px;
    z-index: -1;
    animation: rotate-border 4s linear infinite;
  }
  @keyframes rotate-border {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  .photo-placeholder {
    width: 100%; height: 100%;
    background: var(--surface);
    border-radius: 4px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px;
    position: relative; overflow: hidden;
  }
  .photo-placeholder::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: conic-gradient(from 0deg, transparent 0%, rgba(0,212,170,0.05) 25%, transparent 50%);
    animation: spin 8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .photo-avatar {
    width: 100px; height: 100px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40px;
    color: var(--bg);
    position: relative; z-index: 1;
  }
  .photo-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative; z-index: 1;
  }
  .photo-corner {
    position: absolute;
    width: 20px; height: 20px;
    border-color: var(--accent);
    border-style: solid;
  }
  .photo-corner.tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
  .photo-corner.tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
  .photo-corner.bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; }
  .photo-corner.br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

  .float-badge {
    position: absolute;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 10px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 1px;
    white-space: nowrap;
    animation: float 3s ease-in-out infinite;
  }
  .float-badge:nth-child(2) { bottom: 20px; left: -60px; animation-delay: 0s; }
  .float-badge:nth-child(3) { top: 40px; right: -70px; animation-delay: 1.5s; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  /* SECTIONS */
  section { position: relative; z-index: 1; }
  .section-wrap { max-width: 1200px; margin: 0 auto; padding: 100px 60px; }
  .section-header { margin-bottom: 64px; }
  .section-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(42px, 5vw, 68px);
    letter-spacing: 2px;
    line-height: 1;
    color: var(--text);
  }
  .section-title span { color: var(--accent); }
  .section-line {
    margin-top: 16px;
    width: 60px; height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 80px;
    align-items: start;
  }
  .about-text {
    font-size: 17px;
    line-height: 1.8;
    color: var(--text-muted);
    font-weight: 300;
  }
  .about-text p { margin-bottom: 20px; }
  .about-text strong { color: var(--text); font-weight: 500; }
  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 28px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .stat-card:hover { border-color: var(--accent); transform: translateY(-4px); }
  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: 13px;
    color: var(--text-muted);
    letter-spacing: 0.5px;
  }

  /* SKILLS */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
  .skill-group {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 32px;
    transition: border-color 0.3s, box-shadow 0.3s;
    position: relative; overflow: hidden;
  }
  .skill-group::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transform: scaleX(0);
    transition: transform 0.3s;
    transform-origin: left;
  }
  .skill-group:hover::before { transform: scaleX(1); }
  .skill-group:hover { border-color: var(--accent); box-shadow: var(--glow); }
  .skill-group-icon {
    font-size: 28px; margin-bottom: 16px;
  }
  .skill-group-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag {
    padding: 6px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--text-muted);
    transition: all 0.2s;
  }
  .skill-tag:hover { border-color: var(--accent); color: var(--accent); }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 28px;
  }
  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 36px;
    position: relative; overflow: hidden;
    transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    cursor: pointer;
  }
  .project-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(40px, -40px);
    transition: transform 0.4s;
  }
  .project-card:hover::after { transform: translate(20px, -20px) scale(1.5); }
  .project-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), var(--glow);
  }
  .project-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 60px;
    color: var(--border);
    line-height: 1;
    position: absolute; top: 20px; right: 28px;
    transition: color 0.3s;
  }
  .project-card:hover .project-num { color: rgba(0,212,170,0.15); }
  .project-icon { font-size: 32px; margin-bottom: 20px; }
  .project-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 1px;
    color: var(--text);
    margin-bottom: 12px;
    transition: color 0.3s;
  }
  .project-card:hover .project-name { color: var(--accent); }
  .project-desc {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 24px;
    font-weight: 300;
  }
  .project-stack { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .stack-tag {
    padding: 4px 10px;
    background: rgba(0,212,170,0.08);
    border: 1px solid rgba(0,212,170,0.2);
    border-radius: 2px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--accent);
    letter-spacing: 1px;
  }
  .project-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--text-dim);
    text-transform: uppercase;
    display: flex; align-items: center; gap: 8px;
    transition: color 0.3s;
  }
  .project-card:hover .project-link { color: var(--accent); }

  /* CONTACT */
  .contact-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
  .contact-intro {
    font-size: 17px;
    line-height: 1.8;
    color: var(--text-muted);
    font-weight: 300;
    margin-bottom: 40px;
  }
  .contact-links { display: flex; flex-direction: column; gap: 16px; }
  .contact-link {
    display: flex; align-items: center; gap: 16px;
    padding: 18px 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    text-decoration: none;
    color: var(--text);
    transition: all 0.3s;
    position: relative; overflow: hidden;
  }
  .contact-link::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(0,212,170,0.05), transparent);
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  .contact-link:hover::before { transform: translateX(0); }
  .contact-link:hover { border-color: var(--accent); transform: translateX(6px); }
  .contact-link-icon { font-size: 20px; flex-shrink: 0; }
  .contact-link-info { flex: 1; }
  .contact-link-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .contact-link-value {
    font-size: 15px;
    color: var(--text);
    font-weight: 400;
  }
  .contact-link-arrow { color: var(--text-dim); transition: color 0.3s; }
  .contact-link:hover .contact-link-arrow { color: var(--accent); }

  .contact-form {
    display: flex; flex-direction: column; gap: 20px;
  }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--text-muted);
    text-transform: uppercase;
  }
  .form-input, .form-textarea {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 14px 18px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s;
    resize: none;
  }
  .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-textarea { min-height: 120px; }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--text-dim); }

  /* FOOTER */
  footer {
    position: relative; z-index: 1;
    border-top: 1px solid var(--border);
    padding: 40px 60px;
    display: flex; align-items: center; justify-content: space-between;
    max-width: 100%;
  }
  .footer-copy {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 1px;
  }
  .footer-copy span { color: var(--accent); }
  .social-links { display: flex; gap: 16px; }
  .social-link {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 16px;
    transition: all 0.3s;
  }
  .social-link:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-3px); }

  /* ANIMATIONS */
  .fade-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  .fade-up:nth-child(2) { transition-delay: 0.1s; }
  .fade-up:nth-child(3) { transition-delay: 0.2s; }
  .fade-up:nth-child(4) { transition-delay: 0.3s; }

  @media (max-width: 900px) {
    nav { padding: 20px 24px; }
    .nav-links { display: none; }
    .hero { padding: 100px 24px 60px; }
    .hero-inner { grid-template-columns: 1fr; gap: 40px; }
    .hero-photo-wrap { order: -1; }
    .photo-frame { width: 240px; height: 280px; }
    .float-badge { display: none; }
    .section-wrap { padding: 70px 24px; }
    .about-grid, .contact-wrap { grid-template-columns: 1fr; gap: 40px; }
    footer { padding: 30px 24px; flex-direction: column; gap: 20px; text-align: center; }
  }
`;

const projects = [
  {
    num: "01",
    icon: "🎓",
    name: "KUST Alumni Sense",
    desc: "A comprehensive alumni management and networking platform for Kohat University of Science & Technology, connecting graduates and fostering professional relationships.",
    stack: ["Angular.js", "Node.js", "MongoDB", "Express.js"],
  },
  {
    num: "02",
    icon: "🎬",
    name: "Videotube",
    desc: "A full-featured video sharing and streaming platform with user authentication, channel management, and real-time engagement features inspired by YouTube.",
    stack: ["React.js", "Node.js", "MongoDB", "Express.js"],
    link: "https://github.com/TaimoorHashim/Backend_App",
  },
  {
    num: "03",
    icon: "🛍️",
    name: "E-commerce Website",
    desc: "A feature-rich online shopping platform with product management, cart functionality, secure checkout, and an intuitive admin dashboard.",
    stack: ["React.js", "Node.js", "MySQL", "Express.js"],
    link: "https://github.com/TaimoorHashim/E-commerce",
  },
  {
    num: "04",
    icon: "✈️",
    name: "Traveling Agency System",
    desc: "A complete travel booking and management system for agencies, featuring destination discovery, itinerary planning, and booking management.",
    stack: ["MySQL", "Python"],
    link: "https://github.com/TaimoorHashim/Travel_Agency",
  },
];

const skillGroups = [
  {
    icon: "⚛️",
    name: "Frontend",
    tags: ["React.js", "HTML5", "CSS3", "JavaScript", "Angular.js"],
  },
  { icon: "⚙️", name: "Backend", tags: ["Node.js", "Express.js", "REST APIs"] },
  { icon: "🗄️", name: "Databases", tags: ["MongoDB", "Mongoose", "MySQL"] },
  { icon: "🔧", name: "Languages", tags: ["JavaScript", "Python"] },
  {
    icon: "🛠️",
    name: "Tools & Platforms",
    tags: ["GitHub", "Git", "VS Code", "Postman"],
  },
];

const contacts = [
  {
    icon: "📞",
    label: "Phone",
    value: "0335 5885074",
    href: "tel:03355885074",
  },
  {
    icon: "📧",
    label: "Email",
    value: "taimoor00966@gmail.com",
    href: "mailto:taimoor00966@gmail.com",
  },
  {
    icon: "🔗",
    label: "LinkedIn",
    value: "linkedin.com/in/taimoorhashim",
    href: "https://linkedin.com/in/taimoorhashim",
  },
  {
    icon: "💻",
    label: "GitHub",
    value: "github.com/TaimoorHashim",
    href: "https://github.com/TaimoorHashim/TaimoorHashim",
  },
];

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const ringRef = useRef({ x: -100, y: -100 });
  const animRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      setHovering(
        target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.classList.contains("project-card") ||
          target.classList.contains("skill-group"),
      );
    };
    window.addEventListener("mousemove", move);

    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      setCursorPos((prev) => {
        ringRef.current.x = lerp(ringRef.current.x, prev.x, 0.12);
        ringRef.current.y = lerp(ringRef.current.y, prev.y, 0.12);
        setRingPos({ ...ringRef.current });
        return prev;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    // Intersection Observer for fade-up
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="grid-bg" />

      {/* CURSOR */}
      <div
        className="cursor cursor-dot"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <div
        className={`cursor cursor-ring ${hovering ? "hover" : ""}`}
        style={{ left: ringPos.x, top: ringPos.y }}
      />

      {/* NAV */}
      <nav>
        <div className="nav-logo">TH</div>
        <ul className="nav-links">
          {["About", "Skills", "Projects", "Contact"].map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}>{l}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-tag">Available for work</div>
            <h1 className="hero-name">
              Taimoor
              <br />
              Hashim
            </h1>
            <p className="hero-role">
              <span>Grade: "A"</span> <br />
              <span>BS Computer Science / Web Developer</span> — building scalable
              full-stack applications with modern technologies and clean
              architecture.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">
                View Projects →
              </a>
              <a href="#contact" className="btn btn-outline">
                Get in Touch
              </a>
            </div>
          </div>
          <div className="hero-photo-wrap">
            <div className="photo-frame">
              <img
                src={profilePic}
                alt="Taimoor Hashim"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  display: "block",
                }}
              />
              <div className="photo-corner tl" />
              <div className="photo-corner tr" />
              <div className="photo-corner bl" />
              <div className="photo-corner br" />
            </div>
            <div className="float-badge">⚡ MERN Stack</div>
            <div className="float-badge">🚀 Full Stack Dev</div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-wrap">
          <div className="section-header fade-up">
            <div className="section-eyebrow">// 01 — About</div>
            <h2 className="section-title">
              Who I <span>Am</span>
            </h2>
            <div className="section-line" />
          </div>
          <div className="about-grid">
            <div className="about-text fade-up">
              <p>
                I'm <strong>Taimoor Hashim</strong>, a passionate{" "}
                <strong>MERN Stack Web Developer</strong> who transforms ideas
                into robust, scalable digital products. I specialize in building
                end-to-end web applications using MongoDB, Express.js, React.js,
                and Node.js.
              </p>
              <p>
                With a strong foundation in both frontend and backend
                development, I craft seamless user experiences backed by
                reliable, performant server-side architecture. I believe in
                writing clean code and building systems that scale.
              </p>
              <p>
                I'm constantly exploring new technologies and best practices to
                stay at the cutting edge of modern web development.
              </p>
            </div>
            <div className="about-stats">
              {[
                { num: "16+", label: "Projects Completed" },
                { num: "4+", label: "Years of Coding" },
                { num: "10+", label: "Technologies" },
                { num: "∞", label: "Lines of Code" },
              ].map((s, i) => (
                <div className="stat-card fade-up" key={i}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ background: "rgba(12,20,25,0.6)" }}>
        <div className="section-wrap">
          <div className="section-header fade-up">
            <div className="section-eyebrow">// 02 — Skills</div>
            <h2 className="section-title">
              Tech <span>Stack</span>
            </h2>
            <div className="section-line" />
          </div>
          <div className="skills-grid">
            {skillGroups.map((g, i) => (
              <div className="skill-group fade-up" key={i}>
                <div className="skill-group-icon">{g.icon}</div>
                <div className="skill-group-name">{g.name}</div>
                <div className="skill-tags">
                  {g.tags.map((t) => (
                    <span className="skill-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-wrap">
          <div className="section-header fade-up">
            <div className="section-eyebrow">// 04 — Projects</div>
            <h2 className="section-title">
              Featured <span>Work</span>
            </h2>
            <div className="section-line" />
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div className="project-card fade-up" key={i}>
                <div className="project-num">{p.num}</div>
                <div className="project-icon">{p.icon}</div>
                <div className="project-name">{p.name}</div>
                <div className="project-desc">{p.desc}</div>
                <div className="project-link">
                  <a href={p.link} target="_blank" rel="noopener noreferrer">
                    Github Repo
                  </a>
                  <span>→</span>
                </div>
                <br />
                <div className="project-stack">
                  {p.stack.map((s) => (
                    <span className="stack-tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: "rgba(12,20,25,0.6)" }}>
        <div className="section-wrap">
          <div className="section-header fade-up">
            <div className="section-eyebrow">// 04 — Contact</div>
            <h2 className="section-title">
              Let's <span>Connect</span>
            </h2>
            <div className="section-line" />
          </div>
          <div className="contact-wrap">
            <div className="fade-up">
              <p className="contact-intro">
                I'm currently open to new opportunities and collaborations.
                Whether you have a project in mind, want to discuss a role, or
                just want to say hello — my inbox is always open.
              </p>
              <div className="contact-links">
                {contacts.map((c, i) => (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                    key={i}
                  >
                    <span className="contact-link-icon">{c.icon}</span>
                    <div className="contact-link-info">
                      <div className="contact-link-label">{c.label}</div>
                      <div className="contact-link-value">{c.value}</div>
                    </div>
                    <span className="contact-link-arrow">→</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="contact-form fade-up">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell me about your project or opportunity..."
                ></textarea>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() =>
                  (window.location.href = "mailto:taimoor00966@gmail.com")
                }
              >
                Send Message →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">
          © 2026 <span>Taimoor Hashim</span> — Crafted with ☕ and lots of ❤️
        </div>
        <div className="social-links">
          <a
            href="https://github.com/TaimoorHashim/TaimoorHashim"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            title="GitHub"
          >
            ⌨
          </a>
          <a
            href="https://linkedin.com/in/taimoorhashim"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            title="LinkedIn"
          >
            in
          </a>
          <a
            href="mailto:taimoor00966@gmail.com"
            className="social-link"
            title="Email"
          >
            ✉
          </a>
        </div>
      </footer>
    </>
  );
}
