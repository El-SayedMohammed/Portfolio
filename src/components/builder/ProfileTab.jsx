import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  Share2,
  Plus,
  Sparkles,
  UploadCloud,
  UserCircle,
  Loader2,
  X,
  RotateCw,
  Code2
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAI, useGithub } from '../../hooks/usePortfolioHooks';
import './ProfileTab.css';

const ProfileTab = () => {
  const { portfolioData, updatePersonalInfo, setPortfolioData } = usePortfolio();
  const { enhanceContent, isGenerating } = useAI();
  const { fetchRepos, isLoading: isFetchingGithub } = useGithub();
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      const skills = portfolioData.personalInfo.skills || [];
      if (!skills.includes(newSkill.trim())) {
        updatePersonalInfo({ skills: [...skills, newSkill.trim()] });
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const skills = portfolioData.personalInfo.skills || [];
    updatePersonalInfo({ skills: skills.filter(s => s !== skillToRemove) });
  };

  const handleGithubFetch = async () => {
    if (!portfolioData.personalInfo.github_user) return;
    const data = await fetchRepos(portfolioData.personalInfo.github_user);
    if (data && data.repos && data.repos.length > 0) {
      setPortfolioData(prev => ({
        ...prev,
        projects: [...prev.projects, ...data.repos],
        personalInfo: {
          ...prev.personalInfo,
          skills: [...new Set([...(prev.personalInfo.skills || []), ...(data.discoveredSkills || [])])],
          avatar: prev.personalInfo.avatar || data.avatar_url || '',
          about: prev.personalInfo.about || data.githubBio || ''
        }
      }));
    }
  };

  const handleAIEnhance = async () => {
    const currentText = portfolioData.personalInfo.about;
    const enhanced = await enhanceContent(currentText, 'about', portfolioData.personalInfo);
    updatePersonalInfo({ about: enhanced });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="form-step"
    >
      <div className="input-group">
        <label><FaGithub size={14} color="#00D4FF" /> GitHub Username</label>
        <div className="input-with-action">
          <input
            type="text"
            placeholder="alexdev"
            value={portfolioData.personalInfo.github_user || ''}
            onChange={(e) => updatePersonalInfo({ github_user: e.target.value })}
          />
          {isFetchingGithub ? (
            <Loader2 className="refresh-icon spinning" size={18} />
          ) : (
            <RotateCw className="refresh-icon" size={18} onClick={handleGithubFetch} title="Fetch repos" />
          )}
        </div>
        <span className="input-hint">We'll fetch your repos automatically</span>
      </div>

      <div className="input-group">
        <label><User size={14} color="#A855F7" /> Full Name</label>
        <input
          type="text"
          placeholder="Elsayed Mohamed"
          value={portfolioData.personalInfo.name}
          onChange={(e) => updatePersonalInfo({ name: e.target.value })}
        />
      </div>

      <div className="input-group">
        <label><Briefcase size={14} color="#00D4FF" /> Professional Title</label>
        <input
          type="text"
          placeholder="Full Stack Developer"
          value={portfolioData.personalInfo.title}
          onChange={(e) => updatePersonalInfo({ title: e.target.value })}
        />
      </div>

      <div className="input-group">
        <label><UploadCloud size={14} color="#A855F7" /> Profile Picture</label>
        <label className="image-upload-wrapper">
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updatePersonalInfo({ avatar: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <div className="upload-placeholder">
            {portfolioData.personalInfo.avatar ? (
              <span className="upload-success">Image Selected! Click to change.</span>
            ) : (
              <span>Click to upload image (JPG, PNG)</span>
            )}
          </div>
        </label>
      </div>

      <div className="input-group">
        <div className="label-header">
          <label><UserCircle size={14} color="#00D4FF" /> About Me</label>
          <button
            className="text-ai-btn"
            onClick={handleAIEnhance}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 size={12} className="spinning" /> : <Sparkles size={12} />}
            AI Enhance
          </button>
        </div>
        <textarea
          rows="4"
          placeholder="Passionate developer with a love for creating elegant solutions..."
          value={portfolioData.personalInfo.about}
          onChange={(e) => updatePersonalInfo({ about: e.target.value })}
        ></textarea>
        <div className="textarea-footer">
          <span>{portfolioData.personalInfo.about?.length || 0}/500 characters</span>
        </div>
      </div>

      <div className="input-group">
        <label><Code2 size={14} color="#00D4FF" /> Skills</label>
        <div className="skills-input-wrapper">
          <div className="skills-tags">
            {(portfolioData.personalInfo.skills || ['React', 'Node.js', 'Typescript', 'MongoDB']).map(skill => (
              <span key={skill} className="skill-tag">
                {skill} <X size={12} onClick={() => removeSkill(skill)} />
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleAddSkill}
          />
        </div>
      </div>

      <div className="input-group">
        <label><Share2 size={14} color="#A855F7" /> Social Links</label>
        <div className="social-links-manager">
          {(portfolioData.personalInfo.socialLinks || []).map((link, idx) => (
            <div key={idx} className="social-link-entry">
              <select
                className="platform-select"
                value={link.platform}
                onChange={(e) => {
                  const newList = [...portfolioData.personalInfo.socialLinks];
                  newList[idx].platform = e.target.value;
                  updatePersonalInfo({ socialLinks: newList });
                }}
              >
                <option value="gmail">Gmail</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <input
                type="text"
                placeholder="Your profile link or email"
                value={link.url}
                onChange={(e) => {
                  const newList = [...portfolioData.personalInfo.socialLinks];
                  newList[idx].url = e.target.value;
                  updatePersonalInfo({ socialLinks: newList });
                }}
              />
              <div className="remove-social-btn" onClick={() => {
                const newList = portfolioData.personalInfo.socialLinks.filter((_, i) => i !== idx);
                updatePersonalInfo({ socialLinks: newList });
              }}>
                <X size={12} />
              </div>
            </div>
          ))}
          <div
            className="add-social-btn"
            onClick={() => {
              const newList = [...(portfolioData.personalInfo.socialLinks || []), { platform: 'github', url: '' }];
              updatePersonalInfo({ socialLinks: newList });
            }}
          >
            <Plus size={14} /> Add Social Link
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileTab;
