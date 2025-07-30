import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaChartBar, FaUsers, FaStar, FaTrendingUp } from 'react-icons/fa';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchSkillsData();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/analysis/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillsData = async () => {
    try {
      const response = await axios.get('/api/analysis/skills');
      setSkillsData(response.data);
    } catch (error) {
      console.error('Error fetching skills data:', error);
    }
  };

  const getScoreDistribution = () => {
    if (!stats?.scoreDistribution) return [];
    return stats.scoreDistribution.map(item => ({
      range: `${item._id || '100+'}`,
      count: item.count
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <motion.div
        className="stats-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive insights and statistics from resume analysis</p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        className="overview-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers size={40} color="#667eea" />
            </div>
            <div className="stat-content">
              <h3>Total Resumes</h3>
              <div className="stat-value">{stats?.totalResumes || 0}</div>
              <p>Resumes analyzed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaStar size={40} color="#f39c12" />
            </div>
            <div className="stat-content">
              <h3>Average Score</h3>
              <div className="stat-value">{Math.round(stats?.averageScore || 0)}%</div>
              <p>Overall performance</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaTrendingUp size={40} color="#27ae60" />
            </div>
            <div className="stat-content">
              <h3>Top Skill</h3>
              <div className="stat-value">
                {stats?.topSkills[0]?.count > 0 ? stats.topSkills[0]._id : 'N/A'}
              </div>
              <p>Most common skill</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartBar size={40} color="#e74c3c" />
            </div>
            <div className="stat-content">
              <h3>Skills Analyzed</h3>
              <div className="stat-value">{stats?.topSkills.length || 0}</div>
              <p>Unique skills detected</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Score Distribution */}
      <motion.div
        className="score-distribution"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="section-header">
          <h2>Score Distribution</h2>
          <p>How resumes are performing across different score ranges</p>
        </div>

        <div className="distribution-chart">
          {getScoreDistribution().map((item, index) => (
            <div key={index} className="distribution-bar">
              <div className="bar-label">{item.range}</div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(item.count / Math.max(...getScoreDistribution().map(d => d.count))) * 100}%`
                  }}
                ></div>
              </div>
              <div className="bar-value">{item.count}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Skills */}
      {skillsData && (
        <motion.div
          className="top-skills"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="section-header">
            <h2>Top Skills</h2>
            <p>Most frequently detected skills across all resumes</p>
          </div>

          <div className="skills-grid">
            {stats?.topSkills.slice(0, 10).map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-rank">#{index + 1}</div>
                <div className="skill-name">{skill._id}</div>
                <div className="skill-count">{skill.count} resumes</div>
                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{
                      width: `${(skill.count / stats.topSkills[0].count) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Skills Categories */}
      {skillsData && (
        <motion.div
          className="skills-categories"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="section-header">
            <h2>Skills by Category</h2>
            <p>Breakdown of skills across different technology categories</p>
          </div>

          <div className="categories-grid">
            {Object.entries(skillsData.skillCategories).map(([category, skills]) => (
              <div key={category} className="category-card">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className="category-skills">
                  {skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="category-skill">
                      {skill._id} ({skill.count})
                    </span>
                  ))}
                  {skills.length > 5 && (
                    <span className="category-more">
                      +{skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .statistics-page {
          padding: 2rem 0;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .stats-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .stats-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .overview-stats {
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          flex-shrink: 0;
        }

        .stat-content h3 {
          font-size: 1rem;
          color: #666;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .stat-content p {
          color: #666;
          font-size: 0.9rem;
        }

        .score-distribution,
        .top-skills,
        .skills-categories {
          margin-bottom: 3rem;
        }

        .section-header {
          text-align: center;
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

        .distribution-chart {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .distribution-bar {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .bar-label {
          width: 80px;
          font-weight: 600;
          color: #333;
        }

        .bar-container {
          flex: 1;
          height: 20px;
          background: #e1e5e9;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .bar-value {
          width: 60px;
          text-align: right;
          font-weight: 600;
          color: #333;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .skill-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .skill-rank {
          font-size: 0.9rem;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .skill-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .skill-count {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .skill-bar {
          height: 8px;
          background: #e1e5e9;
          border-radius: 4px;
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .category-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .category-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #333;
          text-transform: capitalize;
        }

        .category-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .category-skill {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .category-more {
          background: #e1e5e9;
          color: #666;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
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
          .stats-header h1 {
            font-size: 2rem;
          }

          .stat-card {
            flex-direction: column;
            text-align: center;
          }

          .distribution-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .bar-label {
            width: auto;
          }

          .bar-value {
            width: auto;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Statistics; 