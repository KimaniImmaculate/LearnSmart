const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, 'learnsmart.db');
        this.db = null;
    }

    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                    return;
                }
                console.log('Connected to SQLite database');
                this.createTables().then(resolve).catch(reject);
            });
        });
    }

    async createTables() {
        return new Promise((resolve, reject) => {
            const createQuestionsTable = `
                CREATE TABLE IF NOT EXISTS questions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    subject TEXT DEFAULT 'general',
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            const createIndexes = `
                CREATE INDEX IF NOT EXISTS idx_questions_timestamp ON questions(timestamp DESC);
                CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
            `;

            this.db.exec(createQuestionsTable, (err) => {
                if (err) {
                    console.error('Error creating questions table:', err);
                    reject(err);
                    return;
                }
                
                this.db.exec(createIndexes, (err) => {
                    if (err) {
                        console.error('Error creating indexes:', err);
                        reject(err);
                        return;
                    }
                    
                    console.log('Database tables and indexes created successfully');
                    resolve();
                });
            });
        });
    }

    async storeQuestion(question, subject, answer) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO questions (question, answer, subject, timestamp)
                VALUES (?, ?, ?, datetime('now'))
            `);

            stmt.run([question, answer, subject], function(err) {
                if (err) {
                    console.error('Error storing question:', err);
                    reject(err);
                    return;
                }

                const questionData = {
                    id: this.lastID,
                    question,
                    answer,
                    subject,
                    timestamp: new Date().toISOString()
                };

                console.log(`Stored question with ID: ${this.lastID}`);
                resolve(questionData);
            });

            stmt.finalize();
        });
    }

    async getRecentQuestions(limit = 10) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, question, subject, timestamp
                FROM questions
                ORDER BY timestamp DESC
                LIMIT ?
            `;

            this.db.all(query, [limit], (err, rows) => {
                if (err) {
                    console.error('Error fetching recent questions:', err);
                    reject(err);
                    return;
                }

                resolve(rows || []);
            });
        });
    }

    async getQuestionById(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, question, answer, subject, timestamp
                FROM questions
                WHERE id = ?
            `;

            this.db.get(query, [id], (err, row) => {
                if (err) {
                    console.error('Error fetching question by ID:', err);
                    reject(err);
                    return;
                }

                resolve(row || null);
            });
        });
    }

    async getQuestionsBySubject(subject, limit = 20) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, question, answer, subject, timestamp
                FROM questions
                WHERE subject = ?
                ORDER BY timestamp DESC
                LIMIT ?
            `;

            this.db.all(query, [subject, limit], (err, rows) => {
                if (err) {
                    console.error('Error fetching questions by subject:', err);
                    reject(err);
                    return;
                }

                resolve(rows || []);
            });
        });
    }

    async getStats() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    COUNT(*) as total_questions,
                    COUNT(DISTINCT subject) as unique_subjects,
                    subject,
                    COUNT(*) as subject_count
                FROM questions
                GROUP BY subject
                ORDER BY subject_count DESC
            `;

            this.db.all(query, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching stats:', err);
                    reject(err);
                    return;
                }

                const stats = {
                    totalQuestions: rows.length > 0 ? rows[0].total_questions : 0,
                    uniqueSubjects: rows.length > 0 ? rows[0].unique_subjects : 0,
                    subjectBreakdown: rows.map(row => ({
                        subject: row.subject,
                        count: row.subject_count
                    }))
                };

                resolve(stats);
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
}

module.exports = Database;