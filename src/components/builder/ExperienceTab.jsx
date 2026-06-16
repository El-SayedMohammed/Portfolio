import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import Button from '../Button';
import './ExperienceTab.css';

const ExperienceTab = () => {
  const {
    portfolioData,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience
  } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="form-step"
    >
      <div className="section-title-form">
        <h3>Experience</h3>
      </div>
      <div className="projects-editor-list">
        {(portfolioData.experience || []).map((exp, idx) => (
          <div key={exp.id} className="project-edit-card glass">
            <div className="project-card-header">
              <h3>Role #{idx + 1}</h3>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteExperience(exp.id)}
                title="Remove Experience"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Job Title"
              value={exp.role || ''}
              onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
            />
            <input
              type="text"
              placeholder="Company"
              value={exp.company || ''}
              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 2021 - 2023)"
              value={exp.year || ''}
              onChange={(e) => updateExperience(exp.id, { year: e.target.value })}
            />
            <textarea
              placeholder="Description"
              rows="2"
              value={exp.description || ''}
              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
            ></textarea>
          </div>
        ))}
        <Button variant="ghost" className="add-project-btn" onClick={addExperience}>
          <Plus size={18} /> Add Experience
        </Button>
      </div>

      <div className="section-title-form" style={{ marginTop: '24px', marginBottom: '12px' }}>
        <h3>Education</h3>
      </div>
      <div className="projects-editor-list">
        {(portfolioData.education || []).map((edu, idx) => (
          <div key={edu.id} className="project-edit-card glass">
            <div className="project-card-header">
              <h3>Degree #{idx + 1}</h3>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteEducation(edu.id)}
                title="Remove Education"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree || ''}
              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
            />
            <input
              type="text"
              placeholder="School / University"
              value={edu.school || ''}
              onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
            />
            <input
              type="text"
              placeholder="Year"
              value={edu.year || ''}
              onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
            />
            <textarea
              placeholder="Description (Optional)"
              rows="2"
              value={edu.description || ''}
              onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
            ></textarea>
          </div>
        ))}
        <Button variant="ghost" className="add-project-btn" onClick={addEducation}>
          <Plus size={18} /> Add Education
        </Button>
      </div>
    </motion.div>
  );
};

export default ExperienceTab;
