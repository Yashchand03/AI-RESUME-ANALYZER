import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaStar, FaCheck, FaTimes, FaLightbulb, FaChartBar } from 'react-icons/fa';

const ResumeAnalysis = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await axios.get(`/api/resumes/${id}`);
      setResume(response.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Error loading resume analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analysis...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="error-container">
        <h2>Resume not found</h2>
        <p>The resume you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <motion.div
        className="analysis-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/dashboard" className="back-button">
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back to Dashboard
        </Link>
        <h1>Resume Analysis</h1>
        <p>{resume.fileName}</p>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        className="score-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="overall-score">
          <div
            className="score-circle large"
            style={{
              '--score': resume.analysis.overallScore,
              color: getScoreColor(resume.analysis.overallScore)
            }}
          >
            {resume.analysis.overallScore}%
          </div>
          <div className="score-info">
            <h2>Overall Score</h2>
            <p className="score-label">{getScoreLabel(resume.analysis.overallScore)}</p>
            <p className="score-description">
              Based on skills, experience, education, and content quality
            </p>
          </div>
        </div>
      </motion.div>

      {/* Detailed Scores */}
      <motion.div
        className="detailed-scores"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="grid grid-2">
          <div className="score-card">
            <h3>Skills Match</h3>
            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${resume.analysis.skillsMatch}%`,
                  backgroundColor: getScoreColor(resume.analysis.skillsMatch)
                }}
              ></div>
            </div>
            <p>{resume.analysis.skillsMatch}%</p>
          </div>
          <div className="score-card">
            <h3>Experience Relevance</h3>
            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${resume.analysis.experienceRelevance}%`,
                  backgroundColor: getScoreColor(resume.analysis.experienceRelevance)
                }}
              ></div>
            </div>
            <p>{resume.analysis.experienceRelevance}%</p>
          </div>
        </div>
      </motion.div>

      {/* Parsed Data */}
      <motion.div
        className="parsed-data"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="grid grid-2">
          <div className="data-card">
            <h3>Personal Information</h3>
            <div className="info-list">
              <p><strong>Name:</strong> {resume.parsedData.name || 'Not found'}</p>
              <p><strong>Email:</strong> {resume.parsedData.email || 'Not found'}</p>
              <p><strong>Phone:</strong> {resume.parsedData.phone || 'Not found'}</p>
              <p><strong>Location:</strong> {resume.parsedData.location || 'Not found'}</p>
            </div>
          </div>

          <div className="data-card">
            <h3>Skills Detected</h3>
            <div className="skills-container">
              {resume.parsedData.skills.length > 0 ? (
                resume.parsedData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="no-data">No skills detected</p>
              )}
            </div>
          </div>
        </div>

        {resume.parsedData.summary && (
          <div className="data-card full-width">
            <h3>Professional Summary</h3>
            <p>{resume.parsedData.summary}</p>
          </div>
        )}

        {resume.parsedData.experience.length > 0 && (
          <div className="data-card full-width">
            <h3>Work Experience</h3>
            <div className="experience-list">
              {resume.parsedData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h4>{exp.title}</h4>
                  <p className="company">{exp.company}</p>
                  <p className="duration">{exp.duration}</p>
                  {exp.description && <p className="description">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.parsedData.education.length > 0 && (
          <div className="data-card full-width">
            <h3>Education</h3>
            <div className="education-list">
              {resume.parsedData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h4>{edu.degree}</h4>
                  <p className="institution">{edu.institution}</p>
                  <p className="year">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Analysis Results */}
      <motion.div
        className="analysis-results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="grid grid-2">
          <div className="result-card">
            <h3><FaCheck style={{ color: '#27ae60', marginRight: '8px' }} />Strengths</h3>
            <ul>
              {resume.analysis.strengths.length > 0 ? (
                resume.analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))
              ) : (
                <li>No specific strengths identified</li>
              )}
            </ul>
          </div>

          <div className="result-card">
            <h3><FaTimes style={{ color: '#e74c3c', marginRight: '8px' }} />Areas for Improvement</h3>
            <ul>
              {resume.analysis.weaknesses.length > 0 ? (
                resume.analysis.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))
              ) : (
                <li>No specific weaknesses identified</li>
              )}
            </ul>
          </div>
        </div>

        <div className="result-card full-width">
          <h3><FaLightbulb style={{ color: '#f39c12', marginRight: '8px' }} />Recommendations</h3>
          <ul>
            {resume.analysis.recommendations.length > 0 ? (
              resume.analysis.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))
            ) : (
              <li>No specific recommendations at this time</li>
            )}
          </ul>
        </div>

        {resume.analysis.keywords.length > 0 && (
          <div className="result-card full-width">
            <h3><FaChartBar style={{ color: '#667eea', marginRight: '8px' }} />Key Keywords</h3>
            <div className="keywords-container">
              {resume.analysis.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .analysis-page {
          padding: 2rem 0;
        }

        .analysis-header {
          margin-bottom: 3rem;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 1rem;
          transition: color 0.3s ease;
        }

        .back-button:hover {
          color: #764ba2;
        }

        .analysis-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .analysis-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .score-section {
          margin-bottom: 3rem;
        }

        .overall-score {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .score-circle.large {
          width: 150px;
          height: 150px;
          font-size: 2.5rem;
        }

        .score-info h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .score-label {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .score-description {
          color: #666;
        }

        .detailed-scores {
          margin-bottom: 3rem;
        }

        .score-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .score-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .score-bar {
          width: 100%;
          height: 12px;
          background: #e1e5e9;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .score-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .score-card p {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
        }

        .parsed-data {
          margin-bottom: 3rem;
        }

        .data-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .data-card.full-width {
          grid-column: 1 / -1;
        }

        .data-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .info-list p {
          margin: 0.5rem 0;
          color: #666;
        }

        .no-data {
          color: #999;
          font-style: italic;
        }

        .experience-item,
        .education-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .experience-item:last-child,
        .education-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .experience-item h4,
        .education-item h4 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .company,
        .institution {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 0.25rem;
        }

        .duration,
        .year {
          color: #666;
          font-size: 0.9rem;
        }

        .description {
          margin-top: 0.5rem;
          color: #666;
          line-height: 1.5;
        }

        .analysis-results {
          margin-bottom: 3rem;
        }

        .result-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .result-card.full-width {
          grid-column: 1 / -1;
        }

        .result-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #333;
          display: flex;
          align-items: center;
        }

        .result-card ul {
          list-style: none;
          padding: 0;
        }

        .result-card li {
          padding: 0.5rem 0;
          color: #666;
          position: relative;
          padding-left: 1.5rem;
        }

        .result-card li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }

        .keywords-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .keyword-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .loading-container,
        .error-container {
          text-align: center;
          padding: 4rem 2rem;
        }

        .error-container h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .error-container p {
          color: #666;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .overall-score {
            flex-direction: column;
            text-align: center;
          }

          .score-circle.large {
            width: 120px;
            height: 120px;
            font-size: 2rem;
          }

          .analysis-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalysis; 