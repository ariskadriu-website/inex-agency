const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATABASE CONFIG (MongoDB) ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inex_agency'; // Fallback for local
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema
const ProjectSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    name: String,
    phase: String,
    status: String,
    milestone: String,
    milestoneDate: String,
    timeline: [{ title: String, date: String, completed: Boolean }],
    invoices: [{ id: String, date: String, amount: String, status: String }],
    messages: [{ sender: String, text: String, date: String }]
});

const Project = mongoose.model('Project', ProjectSchema);

// --- SECURITY CONFIG ---
const ADMIN_KEYS = ["INEX-ARISIADMIN", "INEX-JONIADMIN"];

// --- API ENDPOINTS ---

// 1. LOGIN
app.post('/api/login', async (req, res) => {
    const { key } = req.body;

    // Check Admin
    if (ADMIN_KEYS.includes(key)) {
        return res.json({ success: true, role: 'admin', token: key });
    }

    // Check Client
    const project = await Project.findOne({ key });
    if (project) {
        return res.json({ success: true, role: 'client', token: key, name: project.name });
    }

    res.status(401).json({ success: false, message: 'Invalid Access Key' });
});

// 2. GET PROJECTS
app.get('/api/projects', async (req, res) => {
    const token = req.headers['authorization'];

    // Admin: Get All
    if (ADMIN_KEYS.includes(token)) {
        const allProjects = await Project.find({});
        // Convert Array to Object Key-Map for Frontend Compatibility
        const dbMap = {};
        allProjects.forEach(p => dbMap[p.key] = p);
        return res.json({ success: true, role: 'admin', data: dbMap });
    }

    // Client: Get Own
    const project = await Project.findOne({ key: token });
    if (project) {
        return res.json({ success: true, role: 'client', data: project });
    }

    res.status(403).json({ success: false, message: 'Unauthorized' });
});

// 3. SAVE PROJECT (Admin)
app.post('/api/admin/save', async (req, res) => {
    const token = req.headers['authorization'];
    const { key, data } = req.body;

    if (!ADMIN_KEYS.includes(token)) {
        return res.status(403).json({ success: false, message: 'Admins Only' });
    }

    // Update or Insert (Upsert)
    // Ensure 'key' is in the data object
    const updateData = { ...data, key };

    await Project.findOneAndUpdate({ key }, updateData, { upsert: true, new: true });

    res.json({ success: true, message: 'Project Saved to Cloud' });
});

// 4. SUPPORT API
app.post('/api/support', async (req, res) => {
    const { token, message } = req.body;

    let user = "Unknown";
    // If Admin, for now just log it (in future, reply to specific ID)
    if (ADMIN_KEYS.includes(token)) {
        console.log("Admin sent message:", message);
        return res.json({ success: true, message: 'Admin Message Logged' });
    }

    // If Client, append to their document
    const project = await Project.findOne({ key: token });
    if (project) {
        project.messages.push({
            sender: "Client",
            text: message,
            date: new Date().toISOString()
        });
        await project.save();
        return res.json({ success: true, message: 'Message Sent to HQ' });
    }

    res.status(401).json({ success: false, message: 'Unauthorized' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`- Login Page: http://localhost:${PORT}/login.html`);
});
