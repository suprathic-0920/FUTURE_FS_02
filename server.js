const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Pudhusa add pannirukkom

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- HTML, CSS, JS FILES-A BROWSER-KU ANUPPA MAGIC CODE ---
app.use(express.static(__dirname));

// Direct-a localhost:3000 potta login page-a kaata
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
// ---------------------------------------------------------

// 1. Database Setup (Transactions table added)
const db = new sqlite3.Database('./crm.db', (err) => {
    if (err) console.error('Database Error:', err.message);
    else {
        console.log('✅ Connected to SQLite Database Successfully!');
        
        // Leads Table
        db.run(`CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            source TEXT,
            status TEXT DEFAULT 'New',
            date TEXT,
            notes TEXT DEFAULT ''
        )`);

        // Transactions Table
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            action_type TEXT NOT NULL,
            date TEXT NOT NULL
        )`);
    }
});

// --- ADMIN LOGIN API ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@ssltd.com' && password === 'admin123') {
        res.json({ success: true, token: 'secure-crm-demo-token-12345' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Email or Password!' });
    }
});

// --- LEADS API ---
app.get('/api/leads', (req, res) => {
    db.all("SELECT * FROM leads ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/leads', (req, res) => {
    const { name, email, source, status } = req.body;
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const query = `INSERT INTO leads (name, email, source, status, date) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [name, email, source, status || 'New', date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run(`INSERT INTO transactions (name, action_type, date) VALUES (?, ?, ?)`, [name, 'New Lead', date], (txnErr) => {
            if (txnErr) console.error("Txn Error:", txnErr);
            res.json({ message: 'Lead added successfully!', id: this.lastID });
        });
    });
});

app.put('/api/leads/:id', (req, res) => {
    const { name, status, notes } = req.body; 
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const query = `UPDATE leads SET status = ?, notes = ? WHERE id = ?`;
    db.run(query, [status, notes, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run(`INSERT INTO transactions (name, action_type, date) VALUES (?, ?, ?)`, [name, status, date], (txnErr) => {
            if (txnErr) console.error("Txn Error:", txnErr);
            res.json({ message: 'Lead updated successfully!' });
        });
    });
});

app.delete('/api/leads/:id', (req, res) => {
    db.run(`DELETE FROM leads WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Lead deleted successfully!' });
    });
});

// --- TRANSACTIONS API ---
app.get('/api/transactions', (req, res) => {
    db.all("SELECT * FROM transactions ORDER BY id DESC LIMIT 4", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.listen(port, () => {
    console.log(`🚀 Backend Server is running at http://localhost:${port}`);
});