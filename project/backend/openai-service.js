// openai-service.js
const fetch = require('node-fetch'); // for Node <18
require('dotenv').config();

class OpenAIService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.baseUrl = 'https://api.openai.com/v1/chat/completions';
        console.log('Loaded OpenAI API Key:', !!this.apiKey); // debug: true means key loaded
    }

    async generateAnswer(question, subject, learningStyle = 'visual', isDeafFriendly = false) {
        if (!this.apiKey) {
            console.warn('⚠️ OpenAI API key not found. Returning demo response.');
            return this.generateDemoResponse(question, subject, learningStyle, isDeafFriendly);
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an educational AI assistant for children, deaf-friendly mode: ${isDeafFriendly ? 'YES' : 'NO'}, learning style: ${learningStyle}. Use simple, clear language with visual examples and emojis. Max 300 words.`
                        },
                        {
                            role: 'user',
                            content: `Subject: ${subject}\nQuestion: ${question}`
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const answer = data.choices[0].message.content.trim();

            console.log('✅ AI answer generated');

            return {
                answer,
                visualAids: this.generateVisualAids(question, subject),
                signLanguageInfo: this.generateSignLanguageInfo(question, subject),
                learningStyle
            };

        } catch (error) {
            console.error('❌ OpenAI API request failed:', error);
            // fallback only if API fails
            return this.generateDemoResponse(question, subject, learningStyle, isDeafFriendly);
        }
    }

    generateDemoResponse(question, subject) {
        return {
            answer: `💡 Demo response: "${question}" (Subject: ${subject})`,
            visualAids: [],
            signLanguageInfo: null,
            learningStyle: 'visual'
        };
    }

    generateVisualAids(question, subject) {
        const visuals = {
            mathematics: [{emoji:'🔢',label:'Numbers'},{emoji:'➕',label:'Add'}],
            science: [{emoji:'🔬',label:'Microscope'},{emoji:'🌱',label:'Plants'}],
            history: [{emoji:'🏛️',label:'Buildings'},{emoji:'👑',label:'Leaders'}],
            'sign-language': [{emoji:'🤟',label:'I Love You'},{emoji:'👋',label:'Hello'}]
        };
        return visuals[subject] || [{emoji:'💡',label:'Ideas'}];
    }

    generateSignLanguageInfo(question, subject) {
        const info = {
            mathematics: {keyWords:"Numbers, Count", simpleExplanation:"Use fingers to count", memoryTip:"Finger counting helps!"},
            science: {keyWords:"Experiment, Grow", simpleExplanation:"Watch things change", memoryTip:"Act out plant growth!"},
            'sign-language': {keyWords:"Hello, Thank You", simpleExplanation:"Use hands to talk", memoryTip:"Signs look like actions!"}
        };
        return info[subject] || {keyWords:"Learn, Question", simpleExplanation:"Use visuals", memoryTip:"Look and remember"};
    }

    async simplifyAnswer(originalAnswer, subject) {
        if (!this.apiKey) {
            return `✨ Demo simplified: ${originalAnswer}`;
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `Simplify this text for children (5th grade or below) with emojis and concrete examples.`
                        },
                        { role: 'user', content: originalAnswer }
                    ],
                    max_tokens: 300,
                    temperature: 0.5
                })
            });

            const data = await response.json();
            return data.choices[0].message.content.trim();

        } catch (error) {
            console.error('❌ Failed to simplify answer:', error);
            return `✨ Demo simplified: ${originalAnswer}`;
        }
    }
}

module.exports = OpenAIService;
