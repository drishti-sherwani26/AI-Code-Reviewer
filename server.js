require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const { exec } = require('child_process');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const User = require('./models/User');
const Snippet = require('./models/Snippet'); 

const app = express();

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Hosts your HTML files directly

// Connect to MongoDB
const MONGO_URI = 'mongodb://127.0.0.1:27017/code_reviewer_db'; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
    
// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'DB Error: ' + error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        res.status(200).json({ 
            message: 'Login successful!', 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// ==========================================
// 2. SNIPPET & HISTORY ROUTES
// ==========================================
app.post('/api/snippets/save', async (req, res) => {
    try {
        const { userId, language, code, customInput } = req.body;

        if (!userId || !code) {
            return res.status(400).json({ message: 'Missing user ID or code.' });
        }

        const newSnippet = new Snippet({
            userId,
            language,
            code,
            customInput
        });

        await newSnippet.save();
        res.status(201).json({ message: 'Code saved successfully to your account!' });

    } catch (error) {
        res.status(500).json({ message: 'Error saving code: ' + error.message });
    }
});

app.get('/api/snippets/history/:userId', async (req, res) => {
    try {
        const snippets = await Snippet.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(snippets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history: ' + error.message });
    }
});

app.delete('/api/snippets/:id', async (req, res) => {
    try {
        await Snippet.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Snippet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting snippet: ' + error.message });
    }
});

// ==========================================
// 3. AI CHATBOT ROUTE (Plain English Only)
// ==========================================
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required." });

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `You are an expert coding assistant for an AI Code Reviewer app. 
            Request: ${message}
            
            STRICT RULES:
            - Write in completely normal, conversational, plain English paragraphs.
            - DO NOT use markdown formatting (no ### hashtags, no ** bold stars).
            - Keep it very easy to understand for a beginner.`
        });

        res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error('AI SDK Error:', error.message);
        res.status(500).json({ error: 'Failed to communicate with the AI.' });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Changed index.html to home.html
    exec(`open -a "Google Chrome" http://127.0.0.1:${PORT}/home.html`);
});