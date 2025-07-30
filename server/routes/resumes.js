const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const aiAnalyzer = require('../services/aiAnalyzer');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'), false);
    }
  },
});

// Upload and analyze resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    
    if (req.file.mimetype === 'application/pdf') {
      // Parse PDF
      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text;
    } else if (req.file.mimetype === 'text/plain') {
      // Parse text file
      text = req.file.buffer.toString('utf-8');
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from file' });
    }

    // Analyze the resume using AI
    const analysisResult = await aiAnalyzer.analyzeResume(text);
    
    // Create new resume document
    const resume = new Resume({
      fileName: req.file.originalname,
      originalText: text,
      parsedData: analysisResult.parsedData,
      analysis: analysisResult.analysis,
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded and analyzed successfully',
      resume: resume
    });

  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Error processing resume' });
  }
});

// Get all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Error fetching resumes' });
  }
});

// Get specific resume by ID
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Error fetching resume' });
  }
});

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Error deleting resume' });
  }
});

// Re-analyze resume
router.post('/:id/analyze', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Re-analyze the resume
    const analysisResult = await aiAnalyzer.analyzeResume(resume.originalText);
    
    // Update the resume with new analysis
    resume.parsedData = analysisResult.parsedData;
    resume.analysis = analysisResult.analysis;
    resume.lastAnalyzed = new Date();
    
    await resume.save();

    res.json({
      message: 'Resume re-analyzed successfully',
      resume: resume
    });

  } catch (error) {
    console.error('Error re-analyzing resume:', error);
    res.status(500).json({ error: 'Error re-analyzing resume' });
  }
});

module.exports = router; 