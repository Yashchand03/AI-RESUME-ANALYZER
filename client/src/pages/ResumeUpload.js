import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaCloudUploadAlt, FaFilePdf, FaFileAlt, FaSpinner, FaCheck } from 'react-icons/fa';

const ResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadedFile(file);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resume uploaded and analyzed successfully!');
      navigate(`/analysis/${response.data.resume._id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Error uploading resume');
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const getFileIcon = (fileName) => {
    if (fileName?.toLowerCase().endsWith('.pdf')) {
      return <FaFilePdf size={40} color="#e74c3c" />;
    }
    return <FaFileAlt size={40} color="#3498db" />;
  };

  return (
    <div className="upload-page">
      <motion.div
        className="upload-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="upload-header">
          <h1>Upload Your Resume</h1>
          <p>Upload your resume in PDF or text format for AI-powered analysis</p>
        </div>

        <div className="upload-area">
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'drag-active' : ''} ${isDragReject ? 'drag-reject' : ''}`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="uploading-state">
                <FaSpinner className="spinner" />
                <h3>Analyzing your resume...</h3>
                <p>This may take a few moments</p>
              </div>
            ) : uploadedFile ? (
              <div className="uploaded-state">
                <FaCheck size={40} color="#27ae60" />
                <h3>File uploaded successfully!</h3>
                <p>{uploadedFile.name}</p>
              </div>
            ) : (
              <div className="upload-prompt">
                <FaCloudUploadAlt size={60} color="#667eea" />
                <h3>
                  {isDragActive
                    ? 'Drop your resume here'
                    : 'Drag & drop your resume here'}
                </h3>
                <p>or click to browse files</p>
                <div className="file-types">
                  <span>Supported formats: PDF, TXT</span>
                  <span>Max size: 5MB</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="upload-info">
          <div className="info-card">
            <h3>What we analyze:</h3>
            <ul>
              <li>Personal information and contact details</li>
              <li>Work experience and job history</li>
              <li>Education and qualifications</li>
              <li>Skills and technical competencies</li>
              <li>Professional summary and objectives</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>AI Analysis Features:</h3>
            <ul>
              <li>Overall resume score and rating</li>
              <li>Skills matching and recommendations</li>
              <li>Experience relevance assessment</li>
              <li>Improvement suggestions</li>
              <li>Keyword optimization tips</li>
            </ul>
          </div>
        </div>

        <style jsx>{`
          .upload-page {
            padding: 2rem 0;
          }

          .upload-container {
            max-width: 800px;
            margin: 0 auto;
          }

          .upload-header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .upload-header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #333;
          }

          .upload-header p {
            font-size: 1.1rem;
            color: #666;
          }

          .upload-area {
            margin-bottom: 3rem;
          }

          .dropzone {
            border: 3px dashed #667eea;
            border-radius: 15px;
            padding: 3rem;
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }

          .dropzone:hover {
            border-color: #764ba2;
            background: rgba(255, 255, 255, 0.98);
          }

          .drag-active {
            border-color: #27ae60;
            background: rgba(39, 174, 96, 0.1);
          }

          .drag-reject {
            border-color: #e74c3c;
            background: rgba(231, 76, 60, 0.1);
          }

          .upload-prompt h3 {
            font-size: 1.5rem;
            margin: 1rem 0;
            color: #333;
          }

          .upload-prompt p {
            color: #666;
            margin-bottom: 1rem;
          }

          .file-types {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #888;
          }

          .uploading-state,
          .uploaded-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .uploading-state h3,
          .uploaded-state h3 {
            font-size: 1.3rem;
            color: #333;
          }

          .uploading-state p,
          .uploaded-state p {
            color: #666;
          }

          .spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .upload-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .info-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .info-card h3 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #333;
          }

          .info-card ul {
            list-style: none;
            padding: 0;
          }

          .info-card li {
            padding: 0.5rem 0;
            color: #666;
            position: relative;
            padding-left: 1.5rem;
          }

          .info-card li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #27ae60;
            font-weight: bold;
          }

          @media (max-width: 768px) {
            .upload-header h1 {
              font-size: 2rem;
            }

            .dropzone {
              padding: 2rem;
            }

            .upload-info {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default ResumeUpload; 