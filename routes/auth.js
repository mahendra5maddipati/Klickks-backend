const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post("/register", async (req, res) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) return res.status(500).json({ error: 'DB error' });
            if (row) return res.status(400).json({ error: 'Email already registered' });

            const hash = await bcrypt.hash(password, 10);
            db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
                if (err) return res.status(500).json({ error: 'Could not create user' });
                req.session.userId = this.lastID;
                return res.json({ message: 'User registered', userId: this.lastID });
            });
        });
    } catch (e) {
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });

        req.session.userId = user.id;
        return res.json({ message: 'Logged in' });
    });
});

router.get('/me', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    db.get('SELECT id, email FROM users WHERE id = ?', [req.session.userId], (err, row) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        if (!row) return res.status(401).json({ error: 'Not authenticated' });
        return res.json({ user: row });
    });
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Could not logout' });
        res.clearCookie('sid');
        return res.json({ message: 'Logged out' });
    });
});


module.exports = router;