const natural = require('natural');
const nlp = require('compromise');

class AIAnalyzer {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    
    // Common skills database
    this.skillsDatabase = {
      programming: ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'],
      frameworks: ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net'],
      databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
      tools: ['git', 'github', 'gitlab', 'jira', 'confluence', 'slack', 'trello', 'figma', 'adobe'],
      methodologies: ['agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd']
    };
  }

  async analyzeResume(text) {
    try {
      const doc = nlp(text);
      
      // Extract basic information
      const parsedData = this.extractBasicInfo(doc, text);
      
      // Analyze skills
      const skillsAnalysis = this.analyzeSkills(text);
      
      // Generate scores and recommendations
      const analysis = this.generateAnalysis(parsedData, skillsAnalysis);
      
      return {
        parsedData,
        analysis
      };
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  }

  extractBasicInfo(doc, text) {
    // Extract name (usually at the top)
    const name = doc.match('#Person').first().text() || 'Not found';
    
    // Extract email
    const email = doc.match('#Email').first().text() || 'Not found';
    
    // Extract phone
    const phone = doc.match('#PhoneNumber').first().text() || 'Not found';
    
    // Extract location
    const location = doc.match('#Place').first().text() || 'Not found';
    
    // Extract summary (look for summary section)
    const summaryMatch = text.match(/summary|profile|objective/i);
    let summary = '';
    if (summaryMatch) {
      const summaryIndex = text.toLowerCase().indexOf(summaryMatch[0]);
      const nextSection = text.indexOf('\n\n', summaryIndex);
      summary = text.substring(summaryIndex + summaryMatch[0].length, nextSection > 0 ? nextSection : text.length).trim();
    }
    
    // Extract experience (simplified)
    const experience = this.extractExperience(text);
    
    // Extract education
    const education = this.extractEducation(text);
    
    // Extract skills
    const skills = this.extractSkills(text);
    
    return {
      name,
      email,
      phone,
      location,
      summary,
      experience,
      education,
      skills
    };
  }

  extractExperience(text) {
    const experience = [];
    const lines = text.split('\n');
    let inExperience = false;
    let currentExp = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/experience|work history|employment/i)) {
        inExperience = true;
        continue;
      }
      
      if (inExperience && line.match(/education|skills|projects/i)) {
        break;
      }
      
      if (inExperience && line) {
        // Simple pattern matching for job titles and companies
        const titleMatch = line.match(/(senior|junior|lead|principal|software|developer|engineer|manager|analyst|consultant)/i);
        const companyMatch = line.match(/(inc|corp|llc|ltd|company|tech|systems|solutions)/i);
        
        if (titleMatch && !currentExp.title) {
          currentExp.title = line;
        } else if (companyMatch && !currentExp.company) {
          currentExp.company = line;
        } else if (line.match(/\d{4}/) && !currentExp.duration) {
          currentExp.duration = line;
        } else if (currentExp.title && currentExp.company) {
          currentExp.description = line;
          experience.push({ ...currentExp });
          currentExp = {};
        }
      }
    }
    
    return experience;
  }

  extractEducation(text) {
    const education = [];
    const lines = text.split('\n');
    let inEducation = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/education|academic/i)) {
        inEducation = true;
        continue;
      }
      
      if (inEducation && line.match(/experience|skills|projects/i)) {
        break;
      }
      
      if (inEducation && line) {
        const degreeMatch = line.match(/(bachelor|master|phd|diploma|certificate)/i);
        const yearMatch = line.match(/\d{4}/);
        
        if (degreeMatch) {
          education.push({
            degree: line,
            institution: lines[i + 1] ? lines[i + 1].trim() : '',
            year: yearMatch ? yearMatch[0] : ''
          });
        }
      }
    }
    
    return education;
  }

  extractSkills(text) {
    const skills = [];
    const textLower = text.toLowerCase();
    
    // Check for skills section
    const skillsMatch = text.match(/skills|technologies|tools/i);
    if (skillsMatch) {
      const skillsIndex = textLower.indexOf(skillsMatch[0].toLowerCase());
      const nextSection = text.indexOf('\n\n', skillsIndex);
      const skillsText = text.substring(skillsIndex + skillsMatch[0].length, nextSection > 0 ? nextSection : text.length);
      
      // Extract skills from the skills section
      Object.values(this.skillsDatabase).flat().forEach(skill => {
        if (skillsText.toLowerCase().includes(skill.toLowerCase())) {
          skills.push(skill);
        }
      });
    }
    
    // Also check the entire text for skills
    Object.values(this.skillsDatabase).flat().forEach(skill => {
      if (textLower.includes(skill.toLowerCase()) && !skills.includes(skill)) {
        skills.push(skill);
      }
    });
    
    return skills;
  }

  analyzeSkills(text) {
    const textLower = text.toLowerCase();
    const foundSkills = [];
    const skillCategories = {};
    
    Object.entries(this.skillsDatabase).forEach(([category, skills]) => {
      skillCategories[category] = [];
      skills.forEach(skill => {
        if (textLower.includes(skill.toLowerCase())) {
          foundSkills.push(skill);
          skillCategories[category].push(skill);
        }
      });
    });
    
    return {
      foundSkills,
      skillCategories,
      totalSkills: foundSkills.length
    };
  }

  generateAnalysis(parsedData, skillsAnalysis) {
    // Calculate overall score based on various factors
    let overallScore = 0;
    let skillsMatch = 0;
    let experienceRelevance = 0;
    
    // Skills score (0-40 points)
    const skillsScore = Math.min(skillsAnalysis.totalSkills * 2, 40);
    skillsMatch = skillsScore;
    
    // Experience score (0-30 points)
    const experienceScore = Math.min(parsedData.experience.length * 5, 30);
    experienceRelevance = experienceScore;
    
    // Education score (0-15 points)
    const educationScore = Math.min(parsedData.education.length * 5, 15);
    
    // Summary score (0-15 points)
    const summaryScore = parsedData.summary.length > 50 ? 15 : parsedData.summary.length / 3;
    
    overallScore = skillsScore + experienceScore + educationScore + summaryScore;
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(parsedData, skillsAnalysis);
    
    // Identify strengths and weaknesses
    const strengths = this.identifyStrengths(parsedData, skillsAnalysis);
    const weaknesses = this.identifyWeaknesses(parsedData, skillsAnalysis);
    
    // Extract keywords
    const keywords = this.extractKeywords(parsedData.originalText || '');
    
    return {
      overallScore: Math.round(overallScore),
      skillsMatch: Math.round(skillsMatch),
      experienceRelevance: Math.round(experienceRelevance),
      recommendations,
      strengths,
      weaknesses,
      keywords
    };
  }

  generateRecommendations(parsedData, skillsAnalysis) {
    const recommendations = [];
    
    if (skillsAnalysis.totalSkills < 5) {
      recommendations.push('Add more technical skills to your resume');
    }
    
    if (parsedData.experience.length < 2) {
      recommendations.push('Include more work experience or internships');
    }
    
    if (!parsedData.summary || parsedData.summary.length < 50) {
      recommendations.push('Add a comprehensive professional summary');
    }
    
    if (parsedData.education.length === 0) {
      recommendations.push('Include your educational background');
    }
    
    if (skillsAnalysis.skillCategories.programming.length === 0) {
      recommendations.push('Consider adding programming languages to your skills');
    }
    
    return recommendations;
  }

  identifyStrengths(parsedData, skillsAnalysis) {
    const strengths = [];
    
    if (skillsAnalysis.totalSkills >= 8) {
      strengths.push('Strong technical skillset');
    }
    
    if (parsedData.experience.length >= 3) {
      strengths.push('Good work experience');
    }
    
    if (parsedData.summary && parsedData.summary.length > 100) {
      strengths.push('Well-written professional summary');
    }
    
    if (skillsAnalysis.skillCategories.programming.length >= 3) {
      strengths.push('Strong programming background');
    }
    
    return strengths;
  }

  identifyWeaknesses(parsedData, skillsAnalysis) {
    const weaknesses = [];
    
    if (skillsAnalysis.totalSkills < 5) {
      weaknesses.push('Limited technical skills');
    }
    
    if (parsedData.experience.length < 2) {
      weaknesses.push('Limited work experience');
    }
    
    if (!parsedData.summary || parsedData.summary.length < 50) {
      weaknesses.push('Missing or weak professional summary');
    }
    
    if (skillsAnalysis.skillCategories.cloud.length === 0) {
      weaknesses.push('No cloud computing skills mentioned');
    }
    
    return weaknesses;
  }

  extractKeywords(text) {
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    const keywords = tokens
      .filter(token => token.length > 3 && !stopWords.has(token))
      .slice(0, 20);
    
    return keywords;
  }
}

module.exports = new AIAnalyzer(); 