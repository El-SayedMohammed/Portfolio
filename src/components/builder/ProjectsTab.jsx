import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAI } from '../../hooks/usePortfolioHooks';
import Button from '../Button';
import './ProjectsTab.css';

const ProjectsTab = () => {
  const { portfolioData, addProject, updateProject, deleteProject } = usePortfolio();
  const { enhanceContent, isGenerating } = useAI();

  const handleAIEnhance = async (project) => {
    const currentText = project.description || project.title;
    const enhanced = await enhanceContent(currentText, 'project', project);
    updateProject(project.id, { description: enhanced });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="form-step"
    >
      <div className="projects-editor-list">
        {(portfolioData.projects || []).map((project, idx) => (
          <div key={project.id} className="project-edit-card glass">
            <div className="project-card-header">
              <h3>Project #{idx + 1}</h3>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteProject(project.id)}
                title="Remove Project"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => updateProject(project.id, { title: e.target.value })}
            />

            <div className="project-github-input">
              <FaGithub size={14} />
              <input
                type="text"
                placeholder="GitHub Repository URL"
                value={project.githubUrl || ''}
                onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Project Description"
              rows="3"
              value={project.description}
              onChange={(e) => updateProject(project.id, { description: e.target.value })}
            ></textarea>

            <div className="project-card-footer">
              <div className="tech-tags-list">
                {(project.tech || []).map(t => (
                  <span key={t} className="tech-tag-pill">
                    {t}
                    <span
                      className="remove-tag-btn"
                      onClick={() => {
                        const newTech = project.tech.filter(item => item !== t);
                        updateProject(project.id, { tech: newTech });
                      }}
                    >×</span>
                  </span>
                ))}
                <input
                  type="text"
                  className="project-tech-input"
                  placeholder="+ Add tool..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const newTag = e.target.value.trim();
                      if (!project.tech?.includes(newTag)) {
                        updateProject(project.id, { tech: [...(project.tech || []), newTag] });
                      }
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <Button
                variant="ghost"
                className="project-ai-btn compact"
                onClick={() => handleAIEnhance(project)}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 size={12} className="spinning" /> : <Sparkles size={12} />}
                AI Rewrite
              </Button>
            </div>
          </div>
        ))}
        <Button variant="ghost" className="add-project-btn" onClick={addProject}>
          <Plus size={18} /> Add Project
        </Button>
      </div>
    </motion.div>
  );
};

export default ProjectsTab;
