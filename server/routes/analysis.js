const express = require('express');
const Resume = require('../models/Resume');
const aiAnalyzer = require('../services/aiAnalyzer');

const router = express.Router();

// Get analysis statistics
router.get('/stats', async (req, res) => {
  try {
    const totalResumes = await Resume.countDocuments();
    const avgScore = await Resume.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$analysis.overallScore' } } }
    ]);
    
    const skillStats = await Resume.aggregate([
      { $unwind: '$parsedData.skills' },
      { $group: { _id: '$parsedData.skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const scoreDistribution = await Resume.aggregate([
      {
        $bucket: {
          groupBy: '$analysis.overallScore',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: '100+',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json({
      totalResumes,
      averageScore: avgScore[0]?.avgScore || 0,
      topSkills: skillStats,
      scoreDistribution
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

// Analyze text directly (without saving)
router.post('/text', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const analysisResult = await aiAnalyzer.analyzeResume(text);
    
    res.json({
      message: 'Text analyzed successfully',
      analysis: analysisResult
    });

  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Error analyzing text' });
  }
});

// Get comparison between resumes
router.get('/compare/:id1/:id2', async (req, res) => {
  try {
    const resume1 = await Resume.findById(req.params.id1);
    const resume2 = await Resume.findById(req.params.id2);

    if (!resume1 || !resume2) {
      return res.status(404).json({ error: 'One or both resumes not found' });
    }

    const comparison = {
      resume1: {
        name: resume1.parsedData.name,
        score: resume1.analysis.overallScore,
        skills: resume1.parsedData.skills,
        experience: resume1.parsedData.experience.length
      },
      resume2: {
        name: resume2.parsedData.name,
        score: resume2.analysis.overallScore,
        skills: resume2.parsedData.skills,
        experience: resume2.parsedData.experience.length
      },
      comparison: {
        scoreDifference: resume1.analysis.overallScore - resume2.analysis.overallScore,
        commonSkills: resume1.parsedData.skills.filter(skill => 
          resume2.parsedData.skills.includes(skill)
        ),
        uniqueSkills1: resume1.parsedData.skills.filter(skill => 
          !resume2.parsedData.skills.includes(skill)
        ),
        uniqueSkills2: resume2.parsedData.skills.filter(skill => 
          !resume1.parsedData.skills.includes(skill)
        )
      }
    };

    res.json(comparison);

  } catch (error) {
    console.error('Error comparing resumes:', error);
    res.status(500).json({ error: 'Error comparing resumes' });
  }
});

// Get skills analysis
router.get('/skills', async (req, res) => {
  try {
    const allSkills = await Resume.aggregate([
      { $unwind: '$parsedData.skills' },
      { $group: { _id: '$parsedData.skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const skillCategories = {
      programming: allSkills.filter(skill => 
        ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'].includes(skill._id.toLowerCase())
      ),
      frameworks: allSkills.filter(skill => 
        ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net'].includes(skill._id.toLowerCase())
      ),
      databases: allSkills.filter(skill => 
        ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server'].includes(skill._id.toLowerCase())
      ),
      cloud: allSkills.filter(skill => 
        ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'].includes(skill._id.toLowerCase())
      )
    };

    res.json({
      allSkills,
      skillCategories
    });

  } catch (error) {
    console.error('Error fetching skills analysis:', error);
    res.status(500).json({ error: 'Error fetching skills analysis' });
  }
});

// Get recommendations for improvement
router.get('/recommendations/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const recommendations = {
      current: resume.analysis.recommendations,
      strengths: resume.analysis.strengths,
      weaknesses: resume.analysis.weaknesses,
      suggestedSkills: getSuggestedSkills(resume.parsedData.skills),
      improvementTips: getImprovementTips(resume.analysis)
    };

    res.json(recommendations);

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Error fetching recommendations' });
  }
});

// Helper functions
function getSuggestedSkills(currentSkills) {
  const allSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'mongodb', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'typescript', 'angular', 'vue', 'express',
    'django', 'flask', 'spring', 'mysql', 'postgresql', 'redis', 'azure', 'gcp'
  ];
  
  return allSkills.filter(skill => !currentSkills.includes(skill)).slice(0, 5);
}

function getImprovementTips(analysis) {
  const tips = [];
  
  if (analysis.overallScore < 60) {
    tips.push('Focus on adding more technical skills and experience');
  }
  
  if (analysis.skillsMatch < 30) {
    tips.push('Consider learning in-demand technologies like cloud platforms');
  }
  
  if (analysis.experienceRelevance < 20) {
    tips.push('Include more detailed work experience with quantifiable achievements');
  }
  
  return tips;
}

module.exports = router; 