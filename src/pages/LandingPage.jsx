import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Code, Rocket, ChevronRight, Play, Layers, Search, Smartphone } from 'lucide-react';
import Button from '../components/Button';
import './LandingPage.css';

import dashboardMockup from '../assets/dashboard-hd-clean.png';
import coolPortfolioPreview from '../assets/portfolio-preview-cool.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      
      <nav className="navbar animate-fade-in">
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-box">
            <Sparkles size={20} color="white" />
          </div>
          <span className="gradient-text">PortfolioGenie</span>
        </div>
        <div className="nav-center">
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
          <a href="#dashboard" onClick={(e) => { e.preventDefault(); document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' }); }}>Dashboard</a>
          <a href="#get-started" onClick={(e) => { e.preventDefault(); document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' }); }}>Get Started</a>
        </div>
        <div className="nav-links">
          <Button variant="primary" onClick={() => navigate('/builder')}>Generate AI</Button>
        </div>
      </nav>

      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <div className="badge">
            <Rocket size={14} /> <span>AI-Powered Portfolio Builder</span>
          </div>
          <h1>Build Your <br />
            <span className="gradient-text">Developer Portfolio</span> <br />
            in Minutes
          </h1>
          <p>Transform your GitHub into a stunning portfolio with AI-generated descriptions, optimized layouts, and professional templates.</p>
          <div className="hero-btns">
            <Button variant="primary" className="cta-btn" onClick={() => navigate('/builder')}>
              Start Building Free
            </Button>
            <Button
              variant="outline"
              className="demo-btn"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-image-container"
        >
          <div className="glass hero-main-card">
            <div className="mock-browser-header">
              <div className="browser-dots"><span></span><span></span><span></span></div>
            </div>
            <div className="mock-browser-content">
              <img src={coolPortfolioPreview} alt="Premium Portfolio Preview" />
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="features">
        <div className="features-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to create a professional portfolio</p>
        </div>
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="icon-box"><Rocket /></div>
            <h3>AI-Generated Content</h3>
            <p>Smart descriptions for your projects and skills based on your GitHub activity</p>
          </div>
          <div className="feature-card glass">
            <div className="icon-box"><Code /></div>
            <h3>Live Preview</h3>
            <p>See your portfolio update in real-time as you make changes</p>
          </div>
          <div className="feature-card glass">
            <div className="icon-box"><Sparkles /></div>
            <h3>Export Clean Code</h3>
            <p>Download production-ready HTML, CSS, and React code</p>
          </div>
          <div className="feature-card glass">
            <div className="icon-box"><Layers /></div>
            <h3>Multiple Templates</h3>
            <p>Choose from professionally designed templates or customize your own</p>
          </div>
          <div className="feature-card glass">
            <div className="icon-box"><Search /></div>
            <h3>SEO Optimized</h3>
            <p>Built-in SEO recommendations to help you get discovered</p>
          </div>
          <div className="feature-card glass">
            <div className="icon-box"><Smartphone /></div>
            <h3>Responsive Design</h3>
            <p>Perfect on desktop, tablet, and mobile devices</p>
          </div>
        </div>
      </section>

      <section id="dashboard" className="dashboard-feature">
        <div className="features-header">
          <h2>Intuitive Dashboard</h2>
          <p>Build your portfolio with our easy-to-use interface</p>
        </div>
        <div className="dashboard-mockup">
          <img src={dashboardMockup} alt="Dashboard" className="hq-mockup" />
        </div>
      </section>

      <section id="get-started" className="final-cta">
        <div className="cta-card glass">
          <h2>Ready to build your <span className="gradient-text">Professional Portfolio?</span></h2>
          <p>Join thousands of developers and get started for free.</p>
          <Button variant="primary" onClick={() => navigate('/builder')}>Start Building Now</Button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-box"><Rocket size={20} /></div>
            <span>PortfolioGenie</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <p className="copyright">© 2026 PortfolioGenie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
