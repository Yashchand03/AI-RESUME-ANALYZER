import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaRefresh, FaPlus, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchResumes();
    fetchStats();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resumes');
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Error loading resumes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/analysis/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await axios.delete(`/api/resumes/${id}`);
      toast.success('Resume deleted successfully');
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Error deleting resume');
    }
  };

  const reanalyzeResume = async (id) => {
    try {
      await axios.post(`/api/resumes/${id}/analyze`);
      toast.success('Resume re-analyzed successfully');
      fetchResumes();
    } catch (error) {
      console.error('Error re-analyzing resume:', error);
      toast.error('Error re-analyzing resume');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your resumes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1>Resume Dashboard</h1>
          <p>Manage and view all your uploaded resumes</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <FaPlus style={{ marginRight: '8px' }} />
          Upload New Resume
        </Link>
      </motion.div>

      {/* Stats Section */}
      {stats && (
        <motion.div
          className="stats-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Resumes</h3>
              <div className="stat-value">{stats.totalResumes}</div>
            </div>
            <div className="stat-card">
              <h3>Average Score</h3>
              <div className="stat-value">{Math.round(stats.averageScore)}%</div>
            </div>
            <div className="stat-card">
              <h3>Top Skill</h3>
              <div className="stat-value">
                {stats.topSkills[0]?.count > 0 ? stats.topSkills[0]._id : 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Resumes List */}
      <motion.div
        className="resumes-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="section-header">
          <h2>Your Resumes</h2>
          <p>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} uploaded</p>
        </div>

        {resumes.length === 0 ? (
          <div className="empty-state">
            <FaChartBar size={60} color="#ccc" />
            <h3>No resumes uploaded yet</h3>
            <p>Upload your first resume to get started with AI analysis</p>
            <Link to="/upload" className="btn btn-primary">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                className="resume-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="resume-header">
                  <h3>{resume.fileName}</h3>
                  <div className="resume-score">
                    <div
                      className="score-circle"
                      style={{
                        '--score': resume.analysis.overallScore,
                        color: getScoreColor(resume.analysis.overallScore)
                      }}
                    >
                      {resume.analysis.overallScore}%
                    </div>
                  </div>
                </div>

                <div className="resume-info">
                  <p><strong>Name:</strong> {resume.parsedData.name || 'Not found'}</p>
                  <p><strong>Skills:</strong> {resume.parsedData.skills.length} detected</p>
                  <p><strong>Experience:</strong> {resume.parsedData.experience.length} positions</p>
                  <p><strong>Uploaded:</strong> {formatDate(resume.uploadedAt)}</p>
                </div>

                <div className="resume-actions">
                  <Link
                    to={`/analysis/${resume._id}`}
                    className="btn btn-secondary"
                  >
                    <FaEye style={{ marginRight: '8px' }} />
                    View Analysis
                  </Link>
                  <button
                    onClick={() => reanalyzeResume(resume._id)}
                    className="btn btn-secondary"
                    title="Re-analyze resume"
                  >
                    <FaRefresh style={{ marginRight: '8px' }} />
                    Re-analyze
                  </button>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="btn btn-danger"
                    title="Delete resume"
                  >
                    <FaTrash style={{ marginRight: '8px' }} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .dashboard {
          padding: 2rem 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .header-content p {
          color: #666;
          font-size: 1.1rem;
        }

        .stats-section {
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-card h3 {
          font-size: 1rem;
          color: #666;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #667eea;
        }

        .resumes-section {
          margin-bottom: 3rem;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .section-header p {
          color: #666;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin: 1rem 0;
          color: #333;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 2rem;
        }

        .resumes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .resume-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }

        .resume-card:hover {
          transform: translateY(-5px);
        }

        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .resume-header h3 {
          font-size: 1.2rem;
          color: #333;
          margin: 0;
        }

        .resume-info {
          margin-bottom: 1.5rem;
        }

        .resume-info p {
          margin: 0.5rem 0;
          color: #666;
        }

        .resume-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .resume-actions .btn {
          flex: 1;
          min-width: 120px;
          font-size: 0.9rem;
          padding: 8px 12px;
        }

        .loading-container {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-container p {
          margin-top: 1rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            text-align: center;
          }

          .header-content h1 {
            font-size: 2rem;
          }

          .resumes-grid {
            grid-template-columns: 1fr;
          }

          .resume-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .resume-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard; 