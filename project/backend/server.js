const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./database');
const OpenAIService = require('./openai-service');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const database = new Database();
const openaiService = new OpenAIService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize database
database.initialize().then(() => {
    console.log('Database initialized successfully');
}).catch(err => {
    console.error('Database initialization failed:', err);
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API Routes
app.post('/api/ask', async (req, res) => {
    try {
        const { question, subject, learningStyle, isDeafFriendly } = req.body;
        
        if (!question || question.trim().length === 0) {
            return res.status(400).json({ error: 'Question is required' });
        }

        if (question.length > 500) {
            return res.status(400).json({ error: 'Question too long (max 500 characters)' });
        }

        console.log(`Received question: "${question}" (Subject: ${subject})`);

        // Generate AI response
        const answerData = await openaiService.generateAnswer(question, subject, learningStyle, isDeafFriendly);
        
        // Store in database
        const answer = typeof answerData === 'string' ? answerData : answerData.answer;
        const questionData = await database.storeQuestion(question, subject, answer);
        
        res.json({
            id: questionData.id,
            question: questionData.question,
            answer: answer,
            subject: questionData.subject,
            timestamp: questionData.timestamp,
            visualAids: answerData.visualAids || [],
            signLanguageInfo: answerData.signLanguageInfo || null,
            learningStyle: learningStyle || 'visual'
        });

    } catch (error) {
        console.error('Error processing question:', error);
        res.status(500).json({ 
            error: 'Failed to process question. Please try again.' 
        });
    }
});

app.post('/api/simplify', async (req, res) => {
    try {
        const { originalAnswer, subject } = req.body;
        
        if (!originalAnswer) {
            return res.status(400).json({ error: 'Original answer is required' });
        }

        const simplifiedAnswer = await openaiService.simplifyAnswer(originalAnswer, subject);
        
        res.json({
            simplifiedAnswer: simplifiedAnswer
        });

    } catch (error) {
        console.error('Error simplifying answer:', error);
        res.status(500).json({ 
            error: 'Failed to simplify answer. Please try again.' 
        });
    }
});

app.get('/api/questions/recent', async (req, res) => {
    try {
        const questions = await database.getRecentQuestions(10);
        res.json(questions);
    } catch (error) {
        console.error('Error fetching recent questions:', error);
        res.status(500).json({ error: 'Failed to fetch recent questions' });
    }
});

app.get('/api/questions/:id', async (req, res) => {
    try {
        const question = await database.getQuestionById(req.params.id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'LearnSmart AI Backend'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎓 LearnSmart AI server running on http://localhost:${PORT}`);
    console.log(`📚 Supporting SDG 4: Quality Education for All`);
    console.log(`🤖 AI-powered learning assistance ready!`);
});