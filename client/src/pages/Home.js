import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaUpload, FaChartBar, FaRocket, FaShieldAlt, FaLightbulb } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaBrain />,
      title: 'AI-Powered Analysis',
      description: 'Advanced natural language processing to extract and analyze resume content intelligently.'
    },
    {
      icon: <FaUpload />,
      title: 'Easy Upload',
      description: 'Upload PDF or text files and get instant analysis with detailed insights.'
    },
    {
      icon: <FaChartBar />,
      title: 'Detailed Reports',
      description: 'Comprehensive reports with scores, recommendations, and improvement suggestions.'
    },
    {
      icon: <FaRocket />,
      title: 'Fast Processing',
      description: 'Quick analysis with real-time results and instant feedback.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security measures.'
    },
    {
      icon: <FaLightbulb />,
      title: 'Smart Recommendations',
      description: 'Get personalized suggestions to improve your resume and career prospects.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Resume Analyzer
          </h1>
          <p className="hero-subtitle">
            Transform your resume with intelligent analysis, detailed insights, and personalized recommendations. 
            Get ahead in your career with our advanced AI technology.
          </p>
          <div className="hero-buttons">
            <Link to="/upload" className="btn btn-primary">
              <FaUpload style={{ marginRight: '8px' }} />
              Upload Resume
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              <FaChartBar style={{ marginRight: '8px' }} />
              View Dashboard
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-graphic">
            <FaBrain size={120} color="#667eea" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="section-header">
          <h2>Why Choose Our AI Resume Analyzer?</h2>
          <p>Experience the power of artificial intelligence in resume analysis</p>
        </div>
        
        <div className="grid grid-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="cta-content">
          <h2>Ready to Transform Your Resume?</h2>
          <p>Join thousands of professionals who have improved their career prospects with our AI-powered analysis.</p>
          <Link to="/upload" className="btn btn-primary btn-large">
            <FaRocket style={{ marginRight: '8px' }} />
            Get Started Now
          </Link>
        </div>
      </motion.section>

      <style jsx>{`
        .home {
          padding: 2rem 0;
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 4rem;
          padding: 2rem;
        }

        .hero-content {
          max-width: 600px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-graphic {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .features {
          margin-bottom: 4rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #666;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 3rem;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .cta-content p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-large {
          padding: 15px 30px;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-graphic {
            width: 200px;
            height: 200px;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .cta-content h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 