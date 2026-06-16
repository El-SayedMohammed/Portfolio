export const downloadPortfolioHTML = async (_isMobileMode = false) => {
  const wrapperNode = document.querySelector('.portfolio-canvas-wrapper');
  if (!wrapperNode) {
    alert("Portfolio preview not found!");
    return;
  }

  let cssText = '';
  try {
    const tempContainer = document.createElement('div');
    tempContainer.style.display = 'none';
    tempContainer.appendChild(wrapperNode.cloneNode(true));
    document.body.appendChild(tempContainer);

    const relevantRules = [];
    const seenRules = new Set();

    const stripPseudos = (selector) => {
      return selector
        .replace(/::[\w-]+(\([^)]*\))?/g, '')
        .replace(/:[\w-]+(\([^)]*\))?/g, '')
        .trim();
    };

    const isRelevantSelector = (selectorText) => {
      if (!selectorText) return false;
      
      if (selectorText === '*' ||
          selectorText.includes('body') ||
          selectorText.includes(':root') ||
          selectorText.includes('html')) return true;
      
      if (selectorText.includes('portfolio') ||
          selectorText.includes('navbar') ||
          selectorText.includes('hero') ||
          selectorText.includes('section') ||
          selectorText.includes('skill') ||
          selectorText.includes('project') ||
          selectorText.includes('timeline') ||
          selectorText.includes('contact') ||
          selectorText.includes('glow')) return true;
      
      if (selectorText.includes('builder') ||
          selectorText.includes('tab-') ||
          selectorText.includes('form-') ||
          selectorText.includes('sidebar') ||
          selectorText.includes('ant-') ||
          selectorText.includes('.css-')) return false;

      const parts = selectorText.split(',');
      for (const part of parts) {
        const base = stripPseudos(part.trim());
        if (!base) continue;
        try {
          if (tempContainer.querySelector(base)) return true;
        } catch { return true; }
      }
      return false;
    };

    const processRule = (rule) => {
      const ruleText = rule.cssText;
      if (seenRules.has(ruleText)) return;

      if (rule.type === CSSRule.KEYFRAMES_RULE) {
        seenRules.add(ruleText);
        relevantRules.push(ruleText);
        return;
      }

      if (rule.type === CSSRule.FONT_FACE_RULE) {
        seenRules.add(ruleText);
        relevantRules.push(ruleText);
        return;
      }

      if (rule.type === CSSRule.MEDIA_RULE) {
        let matchedInner = [];
        for (const innerRule of rule.cssRules) {
          if (isRelevantSelector(innerRule.selectorText)) {
            matchedInner.push(innerRule.cssText);
          }
        }
        if (matchedInner.length > 0) {
          const mediaText = `@media ${rule.conditionText} {\n  ${matchedInner.join('\n  ')}\n}`;
          seenRules.add(mediaText);
          relevantRules.push(mediaText);
        }
        return;
      }

      if (rule.selectorText && isRelevantSelector(rule.selectorText)) {
        seenRules.add(ruleText);
        relevantRules.push(ruleText);
      }
    };

    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules || sheet.rules; } catch { continue; }
      if (!rules) continue;
      for (const rule of rules) {
        processRule(rule);
      }
    }

    document.body.removeChild(tempContainer);
    cssText = relevantRules.join('\n');
  } catch (err) {
    console.error("Style gathering failed", err);
  }

  const bodyBg = '#000000';

  let linkTagsHTML = '';
  try {
    const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
    linkTags.forEach(tag => {
      if (!tag.href || (!tag.href.startsWith(window.location.origin) && !tag.href.startsWith('/'))) {
        linkTagsHTML += tag.outerHTML + '\n  ';
      }
    });
  } catch (e) {
    console.error("Link gathering failed", e);
  }

  const navbarScript = `
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const navbar = document.querySelector('.portfolio-navbar');
      const scrollContainer = document.querySelector('.portfolio-content-canvas');
      const navLinks = document.querySelectorAll('.navbar-link');
      const sections = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];

      const menuToggle = document.querySelector('.portfolio-menu-toggle');
      const navbarLinks = document.querySelector('.navbar-links');
      
      if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', function(e) {
          e.stopPropagation();
          const isOpen = navbarLinks.classList.contains('open');
          if (isOpen) {
            navbarLinks.classList.remove('open');
            navbar.classList.remove('menu-open');
            menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
          } else {
            navbarLinks.classList.add('open');
            navbar.classList.add('menu-open');
            menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
          }
        });

        document.addEventListener('click', function(e) {
          if (navbarLinks.classList.contains('open') && !navbar.contains(e.target)) {
            navbarLinks.classList.remove('open');
            navbar.classList.remove('menu-open');
            menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
          }
        });
      }

      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          var id = this.getAttribute('data-section');
          var el = document.getElementById(id);
          if (el && scrollContainer) {
            var containerRect = scrollContainer.getBoundingClientRect();
            var elRect = el.getBoundingClientRect();
            var offset = elRect.top - containerRect.top + scrollContainer.scrollTop - 80;
            scrollContainer.scrollTo({ top: offset, behavior: 'smooth' });
          }
          
          if (navbarLinks) {
            navbarLinks.classList.remove('open');
            navbar.classList.remove('menu-open');
            if (menuToggle) {
              menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
            }
          }
        });
      });

      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', function() {
          var scrollTop = scrollContainer.scrollTop;

          if (scrollTop > 60) {
            navbar.classList.add('navbar-scrolled');
          } else {
            navbar.classList.remove('navbar-scrolled');
          }

          var isAtBottom = scrollContainer.scrollHeight - scrollTop - scrollContainer.clientHeight < 5;

          var current = 'hero';
          var existingSections = sections.filter(function(id) { return document.getElementById(id); });

          if (isAtBottom && existingSections.length > 0) {
            current = existingSections[existingSections.length - 1];
          } else {
            var containerRect = scrollContainer.getBoundingClientRect();
            existingSections.forEach(function(id) {
              var el = document.getElementById(id);
              if (el) {
                var rect = el.getBoundingClientRect();
                if (rect.top - containerRect.top <= 120) {
                  current = id;
                }
              }
            });
          }

          navLinks.forEach(function(link) {
            var indicator = link.querySelector('.navbar-link-indicator');
            if (link.getAttribute('data-section') === current) {
              link.classList.add('active');
              if (!indicator) {
                var span = document.createElement('span');
                span.className = 'navbar-link-indicator';
                link.appendChild(span);
              }
            } else {
              link.classList.remove('active');
              if (indicator) indicator.remove();
            }
          });
        });
      }
    });
  </script>`;

  const clonedWrapper = wrapperNode.cloneNode(true);
  const clonedLinks = clonedWrapper.querySelectorAll('.navbar-link');
  const sectionIds = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];
  clonedLinks.forEach((link, i) => {
    if (i < sectionIds.length) {
      link.setAttribute('data-section', sectionIds[i]);
    }
  });

  const prettifyHTML = (html) => {
    let result = '';
    let indent = 0;
    const tab = '  ';
    
    const voidTags = new Set([
      'area','base','br','col','embed','hr','img','input',
      'link','meta','param','source','track','wbr'
    ]);

    const tokens = html.replace(/>\s*</g, '>\n<').split('\n');

    tokens.forEach(token => {
      const trimmed = token.trim();
      if (!trimmed) return;

      const isClosing = /^<\//.test(trimmed);
      const isSelfClosing = /\/>$/.test(trimmed);
      const tagMatch = trimmed.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      const isVoid = voidTags.has(tagName);

      if (isClosing) {
        indent = Math.max(0, indent - 1);
      }

      result += tab.repeat(indent) + trimmed + '\n';

      if (!isClosing && !isSelfClosing && !isVoid && tagName) {
        indent++;
      }
    });

    return result.trimEnd();
  };

  const formattedContent = prettifyHTML(clonedWrapper.outerHTML);

  const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Professional Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ${linkTagsHTML}
</head>
<body>

  <!-- ============================================== -->
  <!--  YOUR PORTFOLIO CONTENT - EDIT YOUR DATA HERE  -->
  <!-- ============================================== -->
  <div class="portfolio-glow-wrapper">
${formattedContent}
  </div>

  <!-- ============================================== -->
  <!--  STYLES (CSS) - Usually no need to edit below  -->
  <!-- ============================================== -->
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 8px; min-height: 100vh;
      background-color: ${bodyBg};
      font-family: 'Inter', sans-serif;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    a { text-decoration: none; }
    button { cursor: pointer; border: none; outline: none; font-family: inherit; }
    ${cssText}
    :root {
       --bg-main: #000000 !important;
       --bg-darker: #000000 !important;
       --bg-panel: #000000 !important;
       --bg-card: #000000 !important;
       --bg-input: #000000 !important;
    }

    .portfolio-glow-wrapper {
       max-width: 100% !important;
       width: 100% !important;
       min-height: calc(100vh - 16px) !important;
       margin: 0 auto !important;
       border-radius: 14px !important;
       position: relative !important;
       z-index: 1 !important;
       display: flex !important;
       flex-direction: column !important;
       height: calc(100vh - 16px) !important;
       box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.15) !important;
       box-sizing: border-box !important;
    }

    .portfolio-glow-wrapper::before {
       content: "" !important;
       position: absolute !important;
       top: -2px !important; left: -2px !important; right: -2px !important; bottom: -2px !important;
       background: linear-gradient(45deg, #00D4FF, #A855F7, #EC4899, #00D4FF, #A855F7) !important;
       background-size: 400% !important;
       z-index: -1 !important;
       border-radius: 16px !important;
       animation: animatedBorderGlow 6s linear infinite !important;
       opacity: 0.6 !important;
       filter: blur(4px) !important;
       transition: opacity 0.3s ease !important;
    }

    .portfolio-glow-wrapper:hover::before {
       opacity: 1 !important;
       filter: blur(6px) !important;
       background: linear-gradient(45deg, #FF007A, #7928CA, #00D4FF, #FF007A, #7928CA) !important;
       animation: animatedBorderGlow 3s linear infinite !important;
    }

    .portfolio-canvas-wrapper {
       width: 100% !important;
       height: 100% !important;
       border-radius: 12px !important;
       border: 1px solid rgba(255, 255, 255, 0.05) !important;
       position: relative !important;
       overflow: hidden !important;
       z-index: 1;
       display: flex !important;
       flex-direction: column !important;
       background: #000000 !important;
       container-type: inline-size !important;
       container-name: portfolio-container !important;
    }

    .portfolio-navbar {
       display: grid !important;
       grid-template-columns: 1fr auto 1fr !important;
       align-items: center !important;
       padding: 18px 40px !important;
    }
    .portfolio-navbar.navbar-scrolled {
       padding: 14px 40px !important;
    }
    .navbar-brand {
       justify-self: start !important;
       font-size: 22px !important;
    }
    .navbar-links {
       justify-self: center !important;
       padding: 5px 8px !important;
       border-radius: 14px !important;
       gap: 4px !important;
    }
    .navbar-link {
       font-size: 15px !important;
       padding: 10px 22px !important;
       border-radius: 10px !important;
    }

    .portfolio-content-canvas {
       flex: 1 !important;
       min-height: 0 !important;
       overflow-y: auto !important;
       padding: 80px 60px !important;
    }

    .portfolio-content-canvas > div {
       max-width: 1000px !important;
       margin-left: auto !important;
       margin-right: auto !important;
       width: 100% !important;
    }

    @keyframes animatedBorderGlow {
       0% { background-position: 0% 50%; }
       50% { background-position: 100% 50%; }
       100% { background-position: 0% 50%; }
    }

    @media (max-width: 1024px) {
       .portfolio-content-canvas {
          padding: 50px 30px !important;
       }
       .portfolio-navbar {
          padding: 14px 24px !important;
       }
       .navbar-link {
          font-size: 13px !important;
          padding: 8px 14px !important;
       }
       .name-display {
          font-size: 36px !important;
       }
       .profile-image-container {
          width: 150px !important;
          height: 150px !important;
          min-width: 150px !important;
       }
       .profile-image-container img,
       .avatar-letter-placeholder {
          width: 100% !important;
          height: 100% !important;
       }
    }

    @media (max-width: 768px) {

       .portfolio-content-canvas {
          padding: 30px 16px !important;
       }

       .preview-main-hero {
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
          gap: 20px !important;
       }
       .hero-text-content {
          align-items: center !important;
          width: 100% !important;
       }
       .name-display {
          font-size: 28px !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          text-align: center !important;
       }
       .title-display {
          font-size: 14px !important;
          text-align: center !important;
       }
       .about-display {
          font-size: 13px !important;
          text-align: center !important;
       }
       .social-links-display {
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 8px !important;
       }
       .display-icon-box {
          width: 36px !important;
          height: 36px !important;
          font-size: 16px !important;
       }
       .profile-image-container {
          width: 120px !important;
          height: 120px !important;
          min-width: 120px !important;
       }
       .profile-image-container img,
       .avatar-letter-placeholder {
          width: 100% !important;
          height: 100% !important;
       }
       .projects-vertical-grid {
          grid-template-columns: 1fr !important;
       }
       .section-title {
          font-size: 22px !important;
       }
       .portfolio-content-canvas > div {
          max-width: 100% !important;
       }
       .experience-card, .project-card-vertical {
          padding: 16px !important;
       }
       .experience-card-header {
          flex-direction: column !important;
          gap: 8px !important;
       }
       .skills-display-grid {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 8px !important;
       }
       .skill-item {
          padding: 10px !important;
          font-size: 12px !important;
       }

       .portfolio-navbar {
          display: flex !important;
          padding: 12px 16px !important;
          justify-content: space-between !important;
          position: relative !important;
          align-items: center !important;
       }
       .portfolio-navbar.navbar-scrolled {
          padding: 10px 16px !important;
       }
       .navbar-brand {
          font-size: 16px !important;
       }
       .portfolio-menu-toggle {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          width: 36px !important;
          height: 36px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
       }
       .navbar-links {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          background: rgba(0, 0, 0, 0.95) !important;
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          padding: 16px !important;
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 8px !important;
          transform: translateY(-120%) !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
          z-index: 99 !important;
          border-radius: 0px !important;
          width: 100% !important;
          margin: 0 !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5) !important;
       }
       .navbar-links.open {
          transform: translateY(0) !important;
          opacity: 1 !important;
          pointer-events: auto !important;
       }
       .navbar-link {
          font-size: 13px !important;
          padding: 12px 16px !important;
          width: 100% !important;
          text-align: left !important;
          border-radius: 8px !important;
          background: transparent !important;
       }
       .navbar-link.active {
          background: rgba(0, 212, 255, 0.08) !important;
       }
       .navbar-link-indicator {
          display: none !important;
       }
    }
  </style>

  ${navbarScript}
</body>
</html>`;

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'my-portfolio.html',
        types: [{
          description: 'HTML File',
          accept: { 'text/html': ['.html'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(htmlDocument);
      await writable.close();
      return; 
    } catch (err) {
      if (err.name === 'AbortError') return; 
      
    }
  }

  const blob = new Blob([htmlDocument], { type: 'text/html' });
  const objectUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = objectUrl;
  a.download = 'portfolio.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
};
