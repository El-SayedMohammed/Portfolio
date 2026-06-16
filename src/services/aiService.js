export const generateBioPrompt = (userData) => {
  const { name, title, skills } = userData;
  return `
You are an expert developer-advocate and technical copywriter.
Task: Write a professional, engaging "About Me" bio for a developer portfolio.
Context:
- Name: ${name || 'A passionate developer'}
- Current Role/Title: ${title || 'Software Engineer'}
- Key Skills: ${skills && skills.length ? skills.join(', ') : 'Modern web technologies'}

Guidelines:
1. Tone: Professional, enthusiastic, and forward-thinking.
2. Length: 2-3 short paragraphs formatting.
3. Structure: 
   - Introduce the developer and their primary focus.
   - Highlight their technical stack and what they love building.
   - End with a call to action or their immediate career goal.
Do not use generic buzzwords. Focus on readable, impactful language.
`;
}

export const generateProjectPrompt = (projectData) => {
    const { title, tech } = projectData;
    return `
You are an expert SEO specialist and technical writer.
Task: Optimize a project description for readability, impact, and search engine optimization (SEO).
Context:
- Project Title: ${title || 'Awesome Application'}
- Technologies Used: ${tech && tech.length ? tech.join(', ') : 'React, Node.js'}

Guidelines:
1. Write a 3-sentence description describing the problem the project solves.
2. Highlight the specific technologies used to demonstrate technical competency.
3. Use active voice and strong verbs (e.g., "Architected", "Engineered", "Developed").
4. Incorporate relevant keywords naturally to improve SEO for developer portfolios.
`;
}

export const simulateAIBioResponse = async (userData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const { name, title, skills } = userData;
            const hasSkills = skills && skills.length > 0;
            
            const techStack = hasSkills 
                ? (skills.length > 1 
                    ? `${skills.slice(0, -1).join(', ')} and ${skills[skills.length - 1]}`
                    : skills[0])
                : 'cutting-edge tools';
            
            const templates = [
                `I am ${name || 'a passionate developer'}, a dedicated ${title || 'Software Engineer'} specializing in building high-quality, scalable solutions. With a strong foundation in ${techStack}, I focus on writing clean, efficient code and bridging the gap between complex requirements and elegant software design. I am driven by continuous learning and a passion for solving real-world problems through technology.`,
                
                `As a ${title || 'Software Specialist'}, I leverage my expertise in ${techStack} to design and deliver robust, user-centric systems. My development philosophy centers around industry best practices, performance optimization, and creating maintainable codebases. I thrive in collaborative environments and am committed to translating innovative ideas into seamless digital experiences.`,
                
                `I am ${name || 'a professional developer'}, working at the intersection of technology and creative problem-solving. Specializing as a ${title || 'Tech Professional'}, my expertise spans ${techStack}. I am dedicated to crafting reliable, high-performance applications, continually expanding my technical horizon to adopt the most effective tools for each unique challenge.`
            ];

            const idx = Math.floor(Math.random() * templates.length);
            resolve(templates[idx]);
        }, 1200);
    });
}

export const simulateAIProjectDesc = async (projectData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const techStr = projectData.tech?.length ? projectData.tech.join(' and ') : 'advanced algorithms';
            
            const templates = [
                `Architected and developed ${projectData.title || 'this project'} to solve complex challenges using ${techStr}. The solution focuses on maintainability, scalability, and SEO structure. By adhering to clean code conventions and modular design, this project ensures high performance and an intuitive user experience.`,
                `Engineered ${projectData.title || 'this project'} from the ground up leveraging ${techStr} to deliver reliable and highly efficient functionality. Built with modern performance optimizations and clean separation of concerns, the application features an optimized SEO structure and a responsive layout.`,
                `Designed and implemented ${projectData.title || 'this project'} using ${techStr} to solve key user pain points. Focused on performance profiling, clean architecture, and modular UI components, this project showcases best practices in modern software engineering.`,
                `A high-performance solution, ${projectData.title || 'this project'} was developed using ${techStr} to optimize core application workflows. This project emphasizes scalability, comprehensive responsive layouts, and robust technical documentation.`
            ];
            
            const idx = Math.floor(Math.random() * templates.length);
            resolve(templates[idx]);
        }, 1200);
    });
}

