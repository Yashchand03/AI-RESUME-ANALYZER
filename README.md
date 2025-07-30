# AI-Powered Resume Analyzer

A comprehensive web application that uses artificial intelligence to analyze resumes, extract information, and provide intelligent recommendations for improvement.

## Features

- **AI-Powered Analysis**: Advanced natural language processing to extract and analyze resume content
- **PDF & Text Support**: Upload resumes in PDF or text format
- **Comprehensive Scoring**: Overall score, skills match, and experience relevance assessment
- **Smart Recommendations**: Personalized suggestions to improve resume quality
- **Skills Detection**: Automatic detection and categorization of technical skills
- **Analytics Dashboard**: Detailed statistics and insights from all analyzed resumes
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Processing**: Instant analysis with detailed results

## Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Natural** - Natural language processing
- **Compromise** - Text analysis library
- **PDF-Parse** - PDF text extraction
- **Multer** - File upload handling

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **React Dropzone** - File upload interface
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud instance.

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Upload Resume
1. Navigate to the "Upload Resume" page
2. Drag and drop a PDF or text file, or click to browse
3. Wait for the AI analysis to complete
4. View detailed results and recommendations

### View Analysis
1. Go to the Dashboard to see all uploaded resumes
2. Click "View Analysis" on any resume
3. Explore detailed scores, parsed data, and recommendations

### Analytics
1. Visit the Statistics page for comprehensive analytics
2. View score distributions, top skills, and category breakdowns

## API Endpoints

### Resumes
- `POST /api/resumes/upload` - Upload and analyze resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get specific resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/analyze` - Re-analyze resume

### Analysis
- `GET /api/analysis/stats` - Get analysis statistics
- `POST /api/analysis/text` - Analyze text directly
- `GET /api/analysis/compare/:id1/:id2` - Compare two resumes
- `GET /api/analysis/skills` - Get skills analysis
- `GET /api/analysis/recommendations/:id` - Get recommendations

## AI Analysis Features

### Information Extraction
- Personal details (name, email, phone, location)
- Work experience and job history
- Education and qualifications
- Skills and technical competencies
- Professional summary

### Scoring System
- **Overall Score**: Comprehensive assessment (0-100%)
- **Skills Match**: Technical skills evaluation
- **Experience Relevance**: Work experience assessment

### Recommendations
- Skills improvement suggestions
- Experience enhancement tips
- Content optimization advice
- Keyword recommendations

## Project Structure

```
ai-resume-analyzer/
├── server/
│   ├── index.js              # Main server file
│   ├── models/
│   │   └── Resume.js         # MongoDB schema
│   ├── routes/
│   │   ├── resumes.js        # Resume endpoints
│   │   └── analysis.js       # Analysis endpoints
│   └── services/
│       └── aiAnalyzer.js     # AI analysis logic
├── client/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js     # Navigation component
│   │   ├── pages/
│   │   │   ├── Home.js       # Landing page
│   │   │   ├── Dashboard.js  # Resume management
│   │   │   ├── ResumeUpload.js # File upload
│   │   │   ├── ResumeAnalysis.js # Detailed analysis
│   │   │   └── Statistics.js # Analytics dashboard
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Global styles
│   │   └── index.js          # React entry point
│   └── package.json          # Frontend dependencies
├── package.json              # Backend dependencies
└── README.md                 # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

## Future Enhancements

- User authentication and profiles
- Resume templates and customization
- Job matching and recommendations
- Advanced AI models integration
- Mobile application
- API rate limiting and security enhancements 