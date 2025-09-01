# LearnSmart AI - Inclusive Education for Deaf Children

A web application supporting **SDG 4 (Quality Education)** specifically designed for deaf and hard-of-hearing children. The app provides AI-powered explanations using visual learning, simple language, and accessibility features.

## 🎯 Features

- **🤟 Deaf-Friendly Design**: Optimized for visual learning and accessibility
- **👁️ Visual Learning Mode**: Enhanced visual aids and larger text
- **🎨 Visual Aids**: Emoji-based learning supports and diagrams
- **🔊 Text-to-Speech**: Read answers aloud for hearing aid users
- **✨ Answer Simplification**: Make complex answers even simpler
- **🤟 Sign Language Support**: Basic sign language information and resources
- **📱 Responsive Design**: Works on all devices with high contrast options
- **🌈 Learning Styles**: Visual, text-based, simple language, and step-by-step options

## 🏗️ Project Structure

```
learnsmart-ai/
├── frontend/                 # Client-side application
│   ├── index.html            # Main HTML page
│   ├── styles.css            # Styling and responsive design
│   └── script.js             # Frontend JavaScript logic
├── backend/                  # Server-side application
│   ├── server.js             # Express.js server
│   ├── database.js           # SQLite database operations
│   ├── openai-service.js     # OpenAI API integration
│   └── learnsmart.db         # SQLite database (created automatically)
├── package.json              # Node.js dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- OpenAI API key (optional for demo)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### OpenAI API Setup (Optional)

The app works in demo mode without an API key, but for full functionality:

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account and generate an API key
3. Add the key to your `.env` file
4. Restart the server

### Database

The app uses SQLite for simplicity and portability:
- Database file: `backend/learnsmart.db`
- Automatically created on first run
- Stores questions, answers, and metadata

## 📊 Database Schema

### Questions Table
```sql
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    subject TEXT DEFAULT 'general',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 API Endpoints

- `POST /api/ask` - Submit a question and get an AI response
- `GET /api/questions/recent` - Get recent questions
- `GET /api/questions/:id` - Get a specific question by ID
- `GET /api/health` - Health check endpoint

## 🎨 Design Features

- **Modern UI**: Clean, professional design with smooth animations
- **Responsive Layout**: Optimized for all screen sizes
- **Accessibility**: Keyboard navigation and screen reader friendly
- **Visual Feedback**: Loading states and hover effects
- **Color System**: Consistent color palette supporting readability

## 🌍 SDG 4 Alignment

This application directly supports **Sustainable Development Goal 4: Quality Education** with specific focus on inclusive education by:

- **🤟 Ensuring inclusive education**: Specifically designed for deaf and hard-of-hearing children
- **👁️ Visual accessibility**: Prioritizes visual learning and clear visual communication
- **🌈 Multiple learning styles**: Accommodates different ways children process information
- **💪 Building confidence**: Encourages questions in a safe, supportive environment
- **🌍 Promoting equality**: Ensures deaf children have equal access to quality education
- **🚀 Digital inclusion**: Familiarizes children with accessible AI-assisted learning

## 🎯 Accessibility Features

- **High contrast mode support** for better visibility
- **Large, clear fonts** optimized for reading
- **Visual learning aids** with emojis and simple graphics
- **Text-to-speech functionality** for hearing aid users
- **Simple, clear language** appropriate for children
- **Step-by-step explanations** that are easy to follow
- **Sign language resources** and basic sign information
- **Reduced motion options** for users with vestibular disorders
## 🔒 Privacy & Security

- Questions and answers are stored locally in SQLite
- No personal information is collected
- OpenAI API calls are made server-side to protect API keys
- CORS enabled for secure cross-origin requests

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Project Dependencies

**Backend:**
- Express.js - Web server framework
- SQLite3 - Local database
- CORS - Cross-origin resource sharing
- dotenv - Environment variable management

**Frontend:**
- Vanilla HTML, CSS, JavaScript
- Google Fonts (Inter)
- No external frameworks for maximum compatibility

## 📝 Usage Tips

1. **🤟 Choose Your Learning Style**: Select visual, text, simple, or step-by-step learning
2. **👁️ Use Visual Mode**: Turn on visual mode for larger text and enhanced visual aids
3. **🔊 Listen to Answers**: Use the read-aloud feature if you use hearing aids
4. **✨ Make It Simpler**: Click "Make Simpler" if an answer is too complex
5. **📚 Review Your History**: Check previous questions to build on your learning
6. **🤔 Ask Follow-ups**: Never hesitate to ask for more explanation

## 🤟 For Deaf and Hard-of-Hearing Learners

This app is designed with you in mind:
- **Visual-first approach**: Everything important is shown, not just heard
- **Clear, simple language**: No confusing big words
- **Step-by-step learning**: Break big ideas into small, easy steps
- **Sign language friendly**: Includes basic sign language information
- **Your pace**: Learn as fast or slow as you want
- **Safe space**: No judgment, just learning and growing
## 🤝 Contributing

This project supports educational equity and quality learning for all. Contributions that enhance accessibility, improve explanations, or add educational features are welcome.

## 📄 License

MIT License - Feel free to use this project to support education in your community!

---

**Supporting SDG 4: Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all - with special focus on deaf and hard-of-hearing learners** 🤟🎓