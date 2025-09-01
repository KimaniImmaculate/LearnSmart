class LearnSmartAI {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.initializeElements();
        this.bindEvents();
        this.loadRecentQuestions();
    }

    initializeElements() {
        this.questionTextarea = document.getElementById('question');
        this.subjectSelect = document.getElementById('subject');
        this.learningStyleSelect = document.getElementById('learningStyle');
        this.askButton = document.getElementById('askButton');
        this.charCount = document.getElementById('charCount');
        this.answerSection = document.getElementById('answerSection');
        this.answerContent = document.getElementById('answerContent');
        this.answerSubject = document.getElementById('answerSubject');
        this.learningStyleTag = document.getElementById('learningStyleTag');
        this.answerTime = document.getElementById('answerTime');
        this.newQuestionBtn = document.getElementById('newQuestionBtn');
        this.readAloudBtn = document.getElementById('readAloudBtn');
        this.simplifyBtn = document.getElementById('simplifyBtn');
        this.visualModeBtn = document.getElementById('visualModeBtn');
        this.recentQuestionsList = document.getElementById('recentQuestionsList');
        this.visualAids = document.getElementById('visualAids');
        this.visualContent = document.getElementById('visualContent');
        this.signLanguageSection = document.getElementById('signLanguageSection');
        this.signLanguageContent = document.getElementById('signLanguageContent');
        
        this.isVisualMode = false;
        this.currentAnswer = null;
    }

    bindEvents() {
        this.questionTextarea.addEventListener('input', () => this.handleTextareaInput());
        this.askButton.addEventListener('click', () => this.handleAskQuestion());
        this.newQuestionBtn.addEventListener('click', () => this.resetForm());
        this.readAloudBtn.addEventListener('click', () => this.readAloud());
        this.simplifyBtn.addEventListener('click', () => this.simplifyAnswer());
        this.visualModeBtn.addEventListener('click', () => this.toggleVisualMode());
        
        // Allow Enter + Ctrl/Cmd to submit
        this.questionTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (!this.askButton.disabled) {
                    this.handleAskQuestion();
                }
            }
        });
    }

    handleTextareaInput() {
        const text = this.questionTextarea.value;
        const charCount = text.length;
        
        this.charCount.textContent = charCount;
        this.askButton.disabled = charCount === 0 || charCount > 500;
        
        // Update character count color
        if (charCount > 450) {
            this.charCount.style.color = '#e53e3e';
        } else if (charCount > 400) {
            this.charCount.style.color = '#dd6b20';
        } else {
            this.charCount.style.color = '#718096';
        }
    }

    async handleAskQuestion() {
        const question = this.questionTextarea.value.trim();
        const subject = this.subjectSelect.value;
        const learningStyle = this.learningStyleSelect.value;

        if (!question) return;

        this.setLoadingState(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    subject: subject || 'general',
                    learningStyle: learningStyle,
                    isDeafFriendly: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayAnswer(data);
            this.loadRecentQuestions(); // Refresh recent questions
            
        } catch (error) {
            console.error('Error asking question:', error);
            this.showError('Sorry, there was an error processing your question. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        this.askButton.classList.toggle('loading', isLoading);
        this.askButton.disabled = isLoading;
        
        if (isLoading) {
            this.askButton.querySelector('.button-text').textContent = 'Thinking...';
        } else {
            this.askButton.querySelector('.button-text').textContent = 'Ask Question';
        }
    }

    displayAnswer(data) {
        this.currentAnswer = data;
        this.answerContent.textContent = data.answer;
        this.answerSubject.textContent = data.subject;
        this.learningStyleTag.textContent = data.learningStyle || 'visual';
        this.answerTime.textContent = new Date(data.timestamp).toLocaleString();
        
        // Show visual aids if available
        if (data.visualAids && data.visualAids.length > 0) {
            this.displayVisualAids(data.visualAids);
        }
        
        // Show sign language content if available
        if (data.signLanguageInfo) {
            this.displaySignLanguageInfo(data.signLanguageInfo);
        }
        
        this.answerSection.classList.remove('hidden');
        this.answerSection.classList.add('fade-in');
        
        // Scroll to answer
        this.answerSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    displayVisualAids(visualAids) {
        this.visualContent.innerHTML = visualAids.map(aid => `
            <div class="visual-item">
                <span class="visual-emoji">${aid.emoji}</span>
                <div class="visual-label">${aid.label}</div>
            </div>
        `).join('');
        this.visualAids.classList.remove('hidden');
    }

    displaySignLanguageInfo(signInfo) {
        this.signLanguageContent.innerHTML = `
            <p><strong>🤟 Key Signs:</strong> ${signInfo.keyWords}</p>
            <p><strong>📝 Simple Explanation:</strong> ${signInfo.simpleExplanation}</p>
            <p><strong>💡 Visual Memory Tip:</strong> ${signInfo.memoryTip}</p>
        `;
        this.signLanguageSection.classList.remove('hidden');
    }

    toggleVisualMode() {
        this.isVisualMode = !this.isVisualMode;
        document.body.classList.toggle('visual-mode-active', this.isVisualMode);
        this.visualModeBtn.classList.toggle('active', this.isVisualMode);
        
        if (this.isVisualMode) {
            this.visualModeBtn.textContent = '👁️ Visual Mode ON';
        } else {
            this.visualModeBtn.textContent = '👁️ Visual Mode';
        }
    }

    readAloud() {
        if (!this.currentAnswer) return;
        
        // Check if speech synthesis is supported
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(this.currentAnswer.answer);
            utterance.rate = 0.8; // Slower rate for better comprehension
            utterance.pitch = 1;
            utterance.volume = 1;
            
            speechSynthesis.speak(utterance);
            
            // Visual feedback
            this.readAloudBtn.textContent = '🔊 Reading...';
            utterance.onend = () => {
                this.readAloudBtn.textContent = '🔊 Read Aloud';
            };
        } else {
            this.showError('Speech synthesis not supported in this browser');
        }
    }

    async simplifyAnswer() {
        if (!this.currentAnswer) return;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/simplify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalAnswer: this.currentAnswer.answer,
                    subject: this.currentAnswer.subject
                })
            });

            if (!response.ok) {
                throw new Error('Failed to simplify answer');
            }

            const data = await response.json();
            this.answerContent.textContent = data.simplifiedAnswer;
            
            // Visual feedback
            this.simplifyBtn.textContent = '✨ Simplified!';
            setTimeout(() => {
                this.simplifyBtn.textContent = '✨ Make Simpler';
            }, 2000);
            
        } catch (error) {
            console.error('Error simplifying answer:', error);
            this.showError('Could not simplify the answer. Please try asking a new question.');
        }
    }
    resetForm() {
        this.questionTextarea.value = '';
        this.subjectSelect.value = '';
        this.learningStyleSelect.value = 'visual';
        this.charCount.textContent = '0';
        this.charCount.style.color = '#718096';
        this.askButton.disabled = true;
        this.answerSection.classList.add('hidden');
        this.visualAids.classList.add('hidden');
        this.signLanguageSection.classList.add('hidden');
        
        // Focus back on textarea
        this.questionTextarea.focus();
    }

    async loadRecentQuestions() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/questions/recent`);
            if (!response.ok) return;
            
            const questions = await response.json();
            this.displayRecentQuestions(questions);
        } catch (error) {
            console.error('Error loading recent questions:', error);
        }
    }

    displayRecentQuestions(questions) {
        if (questions.length === 0) {
            this.recentQuestionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🌟</div>
                    <p>No questions asked yet. Start learning by asking your first question!</p>
                </div>
            `;
            return;
        }

        this.recentQuestionsList.innerHTML = questions.map(q => `
            <div class="question-item slide-in" onclick="app.loadQuestion('${q.question.replace(/'/g, "\\'")}', '${q.subject}')">
                <div class="question-text">${this.truncateText(q.question, 100)}</div>
                <div class="question-meta">
                    <span class="subject-tag">${q.subject}</span>
                    <span>${new Date(q.timestamp).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    loadQuestion(question, subject) {
        this.questionTextarea.value = question;
        this.subjectSelect.value = subject;
        this.handleTextareaInput();
        
        // Scroll to form
        document.querySelector('.question-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message fade-in';
        errorDiv.textContent = message;
        
        this.questionTextarea.parentNode.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LearnSmartAI();
});