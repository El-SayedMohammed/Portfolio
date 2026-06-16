import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  User,
  Briefcase,
  Layers,
  Box,
  Mail,
  Globe,
  Code2,
  Menu,
  X
} from 'lucide-react';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaWhatsapp
} from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import './PortfolioCanvas.css';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'timeline', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const PortfolioCanvas = () => {
  const { portfolioData } = usePortfolio();
  const [animate, setAnimate] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
    const container = canvasRef.current;
    if (!container) return;

    setNavScrolled(container.scrollTop > 60);

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;

    const sections = NAV_ITEMS.map(item => ({
      id: item.id,
      el: document.getElementById(item.id),
    })).filter(s => s.el);

    if (isAtBottom && sections.length > 0) {
      setActiveSection(sections[sections.length - 1].id);
      return;
    }

    let current = 'hero';
    for (const section of sections) {
      const rect = section.el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (rect.top - containerRect.top <= 120) {
        current = section.id;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    const container = canvasRef.current;
    if (!el || !container) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = elRect.top - containerRect.top + container.scrollTop - 80;
    container.scrollTo({ top: offset, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`portfolio-canvas-wrapper ${animate ? 'animate-entrance' : ''}`}>
      
      <nav className={`portfolio-navbar ${navScrolled ? 'navbar-scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="navbar-brand">Portfolio</div>
        <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`navbar-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
              {activeSection === item.id && <span className="navbar-link-indicator" />}
            </button>
          ))}
        </div>
        <button 
          className="portfolio-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X size={20} color="white" /> : <Menu size={20} color="white" />}
        </button>
      </nav>

      <div ref={canvasRef} className="portfolio-content-canvas no-frame">

      <div id="hero" className="preview-main-hero side-by-side">
        <div className="hero-image-content">
          <div className="profile-image-container">
            {portfolioData.personalInfo.avatar ? (
              <img src={portfolioData.personalInfo.avatar} alt="Profile" />
            ) : (
              <div className="avatar-letter-placeholder">
                {portfolioData.personalInfo.name ? portfolioData.personalInfo.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
        </div>

        <div className="hero-text-content">
          <h1 className="name-display">{portfolioData.personalInfo.name || 'Your Full Name'}</h1>
          <p className="title-display">{portfolioData.personalInfo.title || 'Your Professional Title'}</p>

          <div className="social-links-display">
            {(portfolioData.personalInfo.socialLinks || []).map((link, i) => {
              if (!link.url) return null;
              const Icon = {
                gmail: Mail,
                twitter: FaTwitter,
                facebook: FaFacebook,
                instagram: FaInstagram,
                whatsapp: FaWhatsapp,
                github: FaGithub,
                linkedin: FaLinkedin
              }[link.platform] || Globe;

              return (
                <a key={i} className="display-icon-box" href={link.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div id="about" className="preview-about-section">
        <h3 className="section-title"><User size={18} /> About Me</h3>
        <p className="about-display full-width">
          {portfolioData.personalInfo.about || 'Write a brief engaging introduction about yourself, your background, and your professional goals in the sidebar.'}
        </p>
      </div>

      <div id="skills" className="preview-skills-section">
        <div className="section-title"><Code2 size={18} /> Skills</div>
        <div className="skills-pill-cloud">
          {(portfolioData.personalInfo.skills?.length > 0 ? portfolioData.personalInfo.skills : ['Add your skills']).map(skill => (
            <span key={skill} className="skill-pill">{skill}</span>
          ))}
        </div>
      </div>

      <div id="projects" className="preview-projects-section">
        <div className="section-title"><Briefcase size={18} /> Featured Projects</div>
        <div className="projects-vertical-grid">
          {portfolioData.projects?.length > 0 ? (
            portfolioData.projects.map((project, i) => (
              <div key={project.id} className="preview-project-card-vertical">
                <div className="card-top-row">
                  <div className={`project-icon-box icon-bg-${(i % 3) + 1}`}>
                    <Box size={22} />
                  </div>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: 'inherit', display: 'inline-flex' }}>
                      <FaGithub
                        size={18}
                        className="github-link-icon"
                      />
                    </a>
                  )}
                </div>
                <h4>{project.title || 'Project Title'}</h4>
                <p>{project.description || 'Project description goes here.'}</p>
                <div className="card-tech-list-bottom">
                  {(project.tech || []).map(t => <span key={t} className="tech-tag-sm">{t}</span>)}
                </div>
              </div>
            ))
          ) : (
            <div className="preview-project-card-vertical" style={{ opacity: 0.5 }}>
              <div className="card-top-row">
                <div className="project-icon-box icon-bg-1"><Box size={22} /></div>
              </div>
              <h4>Add a Project</h4>
              <p>Your added projects will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {((portfolioData.experience && portfolioData.experience.length > 0) || (portfolioData.education && portfolioData.education.length > 0)) && (
        <div id="timeline" className="timeline-section">
          <div className="section-title"><Layers size={18} /> Experience & Education</div>
          <div className="timeline-container">
            {(portfolioData.experience || []).map((exp) => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{exp.role || 'Job Title'}</h4>
                  <div className="timeline-meta">
                    <span>{exp.company || 'Company'}</span>
                    <span>•</span>
                    <span>{exp.year || 'Year'}</span>
                  </div>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              </div>
            ))}
            {(portfolioData.education || []).map((edu) => (
              <div key={edu.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{edu.degree || 'Degree'}</h4>
                  <div className="timeline-meta">
                    <span>{edu.school || 'School'}</span>
                    <span>•</span>
                    <span>{edu.year || 'Year'}</span>
                  </div>
                  {edu.description && <p>{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="contact" className="preview-contact-section">
        <h2>Let's Work Together</h2>
        <p>I'm currently available for new opportunities. Feel free to reach out!</p>
        <div className="social-links-display" style={{ justifyContent: 'center', marginTop: '20px' }}>
          {(portfolioData.personalInfo.socialLinks || []).map((link, i) => {
            if (!link.url) return null;
            const Icon = {
              gmail: Mail,
              twitter: FaTwitter,
              facebook: FaFacebook,
              instagram: FaInstagram,
              whatsapp: FaWhatsapp,
              github: FaGithub,
              linkedin: FaLinkedin
            }[link.platform] || Globe;

            return (
              <a key={`contact-${i}`} className="display-icon-box" href={link.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Icon size={18} />
              </a>
            );
          })}
        </div>
        <div className="footer-credits">
          Built with PortfolioGenie
        </div>
      </div>
      </div>
    </div>
  );
};

export default PortfolioCanvas;
