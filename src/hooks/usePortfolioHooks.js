import { useState, useCallback } from 'react';
import { 
  simulateAIBioResponse, 
  simulateAIProjectDesc
} from '../services/aiService';

export const useAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const enhanceContent = useCallback(async (content, type, contextData = {}) => {
    setIsGenerating(true);
    let result = content;
    
    try {
      if (type === 'about') {
        const userData = {
          name: contextData.name || null,
          title: contextData.title || null,
          skills: contextData.skills || [content]
        };
        result = await simulateAIBioResponse(userData);
      } else if (type === 'project') {
        const projectData = {
          title: contextData.title || null,
          tech: contextData.tech || [content]
        };
        result = await simulateAIProjectDesc(projectData);
      }
    } catch (error) {
      console.error("AI Generation Error", error);
    }
    
    setIsGenerating(false);
    return result;
  }, []);

  return { enhanceContent, isGenerating };
};

export const useGithub = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchRepos = useCallback(async (username) => {
    if (!username) return { repos: [], discoveredSkills: [] };
    
    setIsLoading(true);
    
    try {
      
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const userData = await userRes.json();

      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      const reposData = await reposRes.json();

      if (!Array.isArray(reposData)) {
          setIsLoading(false);
          return { repos: [], discoveredSkills: [] };
      }

      const reposWithLanguages = await Promise.all(
        reposData.map(async (repo) => {
          try {
            const langsRes = await fetch(repo.languages_url);
            if (langsRes.ok) {
              const langsData = await langsRes.json();
              return { ...repo, languages: Object.keys(langsData) };
            }
          } catch (e) {
            console.error("Error fetching languages for " + repo.name, e);
          }
          return { ...repo, languages: repo.language ? [repo.language] : [] };
        })
      );

      const languageSet = new Set();
      const formattedRepos = reposWithLanguages.map((repo, idx) => {
        const techTags = [];

        if (repo.languages && repo.languages.length > 0) {
          repo.languages.forEach(lang => {
            if (!techTags.includes(lang)) {
              techTags.push(lang);
            }
            languageSet.add(lang);
          });
        } else if (repo.language) {
          techTags.push(repo.language);
          languageSet.add(repo.language);
        }

        if (repo.topics && Array.isArray(repo.topics)) {
          repo.topics.forEach(topic => {
            const formatted = topic.charAt(0).toUpperCase() + topic.slice(1);
            const exists = techTags.some(t => t.toLowerCase() === topic.toLowerCase());
            if (!exists) {
              techTags.push(formatted);
            }
            languageSet.add(formatted);
          });
        }
        
        if (techTags.length === 0) {
          techTags.push('Software');
        }

        return {
          id: repo.id || Date.now() + idx,
          title: repo.name,
          description: repo.description || `A software project built with ${techTags.slice(0, 3).join(', ') || 'code'}.`,
          tech: techTags.slice(0, 5), 
          githubUrl: repo.html_url
        };
      });

      setIsLoading(false);
      return {
          repos: formattedRepos.filter(r => r.title !== username),
          discoveredSkills: Array.from(languageSet),
          githubBio: userData.bio || '',
          avatar_url: userData.avatar_url || ''
      };

    } catch (error) {
      console.error('Github Fetch Error', error);
      setIsLoading(false);
      return { repos: [], discoveredSkills: [] };
    }
  }, []);

  return { fetchRepos, isLoading };
};
