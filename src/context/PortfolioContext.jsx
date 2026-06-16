
import React, { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(() => {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.error('Failed to parse portfolio data from local storage');
      }
    }
    return {
      personalInfo: {
        name: '',
        title: '',
        email: '',
        github: '',
        github_user: '',
        linkedin: '',
        about: '',
        skills: [],
        socialLinks: [],
        avatar: ''
      },
      projects: [],
      experience: [],
      education: [],
    };
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    }, 400); 
    return () => clearTimeout(timer);
  }, [portfolioData]);

  const updatePersonalInfo = React.useCallback((info) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  }, []);

  const addProject = React.useCallback(() => {
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now(), title: '', description: '', tech: [], link: '' }]
    }));
  }, []);

  const updateProject = React.useCallback((id, data) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...data } : p)
    }));
  }, []);

  const deleteProject = React.useCallback((id) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id != id)
    }));
  }, []);

  const addEducation = React.useCallback(() => {
    setPortfolioData(prev => ({
      ...prev,
      education: [...(prev.education || []), { id: Date.now(), degree: '', school: '', year: '', description: '' }]
    }));
  }, []);

  const updateEducation = React.useCallback((id, data) => {
    setPortfolioData(prev => ({
      ...prev,
      education: (prev.education || []).map(e => e.id === id ? { ...e, ...data } : e)
    }));
  }, []);

  const deleteEducation = React.useCallback((id) => {
    setPortfolioData(prev => ({
      ...prev,
      education: (prev.education || []).filter(e => e.id != id)
    }));
  }, []);

  const addExperience = React.useCallback(() => {
    setPortfolioData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { id: Date.now(), role: '', company: '', year: '', description: '' }]
    }));
  }, []);

  const updateExperience = React.useCallback((id, data) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: (prev.experience || []).map(e => e.id === id ? { ...e, ...data } : e)
    }));
  }, []);

  const deleteExperience = React.useCallback((id) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter(e => e.id != id)
    }));
  }, []);

  const clearPortfolio = React.useCallback(() => {
    if (window.confirm("Are you sure you want to clear all data and reset the portfolio?")) {
      setPortfolioData({
        personalInfo: {
          name: '',
          title: '',
          email: '',
          github: '',
          github_user: '',
          linkedin: '',
          about: '',
          skills: [],
          socialLinks: [],
          avatar: ''
        },
        projects: [],
        experience: [],
        education: [],
      });
      localStorage.removeItem('portfolioData');
    }
  }, []);

  const [isMobileView, setIsMobileView] = useState(false);

  const contextValue = React.useMemo(() => ({
    portfolioData,
    updatePersonalInfo,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    clearPortfolio,
    setPortfolioData,
    isMobileView,
    setIsMobileView
  }), [
    portfolioData,
    isMobileView,
    updatePersonalInfo,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    clearPortfolio
  ]);

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
