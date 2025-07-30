const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  parsedData: {
    name: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      year: String
    }],
    skills: [String],
    certifications: [String]
  },
  analysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    skillsMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    experienceRelevance: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendations: [String],
    strengths: [String],
    weaknesses: [String],
    keywords: [String]
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastAnalyzed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema); 