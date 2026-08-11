const { exec } = require('child_process');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Hosts your HTML files directly

// Connect to MongoDB
const MONGO_URI = 'mongodb://127.0.0.1:27017/code_reviewer_db'; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
    

// Register Route
// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        // This forces the exact database error to show up in your browser alert!
        res.status(500).json({ message: 'DB Error: ' + error.message });
    }
});


// Login Route
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

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // This command automatically opens Chrome to your homepage!
    exec(`open -a "Google Chrome" http://127.0.0.1:${PORT}/index.html`);
});

