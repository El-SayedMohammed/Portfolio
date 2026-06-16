import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Layers,
  ChevronRight,
  ChevronLeft,
  Eye,
  Sparkles,
  Download,
  Code2,
  Trash2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import Button from '../components/Button';
import ProfileTab from '../components/builder/ProfileTab';
import ProjectsTab from '../components/builder/ProjectsTab';
import ExperienceTab from '../components/builder/ExperienceTab';
import PortfolioCanvas from '../components/portfolio/PortfolioCanvas';
import { downloadPortfolioHTML } from '../utils/exportPortfolio';
import './Builder.css';

const Builder = () => {
  const navigate = useNavigate();
  const {
    portfolioData,
    clearPortfolio,
    isMobileView
  } = usePortfolio();

  const [currentTab, setCurrentTab] = useState('Profile');
  const [mobileActiveTab, setMobileActiveTab] = useState('editor'); 

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'Projects', label: 'Projects', icon: <Briefcase size={18} /> },
    { id: 'Experience', label: 'Experience', icon: <Layers size={18} /> }
  ];

  return (
    <div className="builder-layout">
      
      <header className="builder-top-header">
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-box">
            <Sparkles size={20} color="white" />
          </div>
          <span className="logo-text">PortfolioGenie</span>
        </div>

        <nav className="top-nav">
          <div className={`top-nav-item ${currentTab === 'Profile' ? 'active' : ''}`} onClick={() => setCurrentTab('Profile')}>
            <User size={18} /> <span>Profile</span>
          </div>
          <div className={`top-nav-item ${currentTab === 'Projects' ? 'active' : ''}`} onClick={() => setCurrentTab('Projects')}>
            <Briefcase size={18} /> <span>Projects</span>
          </div>
          <div className={`top-nav-item ${currentTab === 'Experience' ? 'active' : ''}`} onClick={() => setCurrentTab('Experience')}>
            <Layers size={18} /> <span>Experience</span>
          </div>
          <div className="top-nav-item" onClick={() => downloadPortfolioHTML(isMobileView)}>
            <Download size={18} /> <span>Export</span>
          </div>
        </nav>

        <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
          <Button 
            variant="ghost" 
            className="clear-btn" 
            onClick={clearPortfolio}
            style={{ 
              color: '#ff4d4d', 
              borderColor: 'rgba(255, 77, 77, 0.2)', 
              background: 'rgba(255, 77, 77, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={16} /> <span>Reset</span>
          </Button>
          <Button variant="primary" className="ai-gen-btn">
            <Sparkles size={16} /> <span>Generate AI</span>
          </Button>
        </div>
      </header>

      <div className="mobile-view-selector animate-fade-in">
        <button 
          className={`mobile-view-tab-btn ${mobileActiveTab === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileActiveTab('editor')}
        >
          <Code2 size={16} /> <span>Editor</span>
        </button>
        <button 
          className={`mobile-view-tab-btn ${mobileActiveTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileActiveTab('preview')}
        >
          <Eye size={16} /> <span>Preview</span>
        </button>
      </div>

      <main className="main-dashboard">
        
        <aside className={`form-sidebar ${mobileActiveTab === 'editor' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <div className="sidebar-header-area">
            <div className="sidebar-title-row">
              <h2>Build Your Portfolio</h2>
              <span className="step-info">Step {tabs.findIndex(t => t.id === currentTab) + 1} of 3</span>
            </div>
            <div className="tab-progress-bar">
              <div className="progress-fill" style={{ width: `${((tabs.findIndex(t => t.id === currentTab) + 1) / 3) * 100}%` }}></div>
            </div>

            <div className="builder-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${currentTab === tab.id ? 'active' : ''}`}
                  onClick={() => setCurrentTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-content-area scrollable">
            
            {currentTab === 'Profile' && <ProfileTab portfolioData={portfolioData} />}
            {currentTab === 'Projects' && <ProjectsTab portfolioData={portfolioData} />}
            {currentTab === 'Experience' && <ExperienceTab portfolioData={portfolioData} />}

            <div className="sidebar-footer-actions inline-actions">
              <Button
                variant="secondary"
                className="back-btn-ui"
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === currentTab);
                  if (idx > 0) setCurrentTab(tabs[idx - 1].id);
                }}
                disabled={currentTab === 'Profile'}
              >
                <ChevronLeft size={18} /> Back
              </Button>
              <Button
                variant="primary"
                className="next-btn-ui"
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === currentTab);
                  if (idx < tabs.length - 1) {
                    setCurrentTab(tabs[idx + 1].id);
                  } else {
                    downloadPortfolioHTML(isMobileView);
                  }
                }}
              >
                {currentTab === 'Experience' ? 'Download Code' : 'Next'} <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </aside>

        <section className={`preview-container ${mobileActiveTab === 'preview' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <div className="preview-top-bar">
            <h2>Live Preview</h2>
            <div className="preview-tools">
              <button className="preview-action-btn primary" onClick={() => downloadPortfolioHTML(isMobileView)}>
                <Download size={16} /> Download Code
              </button>
            </div>
          </div>

          <div className={`preview-viewport glass ${isMobileView ? 'mobile-view' : ''}`}>
            <PortfolioCanvas portfolioData={portfolioData} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Builder;
