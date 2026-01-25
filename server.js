const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files (Netlify handles this via 'publish' dir, but this acts as fallback for local)
const router = express.Router();

// --- DATABASE CONFIG (MongoDB) ---
const MONGO_URI = process.env.MONGO_URI;

// Connect outside handler to reuse connection (Optimized for Lambda)
let conn = null;
const connectDB = async () => {
    if (conn == null) {
        conn = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        return conn;
    }
    return conn;
};


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

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const ADMIN_KEYS = ["INEX-ARISIADMIN", "INEX-JONIADMIN"];

// --- ROUTES ---

router.get('/', (req, res) => {
    res.json({ message: "iNEX API is running!" });
});

// 1. LOGIN
router.post('/login', async (req, res) => {
    await connectDB();
    const { key } = req.body;

    if (ADMIN_KEYS.includes(key)) {
        return res.json({ success: true, role: 'admin', token: key });
    }

    const project = await Project.findOne({ key });
    if (project) {
        return res.json({ success: true, role: 'client', token: key, name: project.name });
    }

    res.status(401).json({ success: false, message: 'Invalid Access Key' });
});

// 2. GET PROJECTS
router.get('/projects', async (req, res) => {
    await connectDB();
    const token = req.headers['authorization'];

    if (ADMIN_KEYS.includes(token)) {
        const allProjects = await Project.find({});
        const dbMap = {};
        allProjects.forEach(p => dbMap[p.key] = p);
        return res.json({ success: true, role: 'admin', data: dbMap });
    }

    const project = await Project.findOne({ key: token });
    if (project) {
        return res.json({ success: true, role: 'client', data: project });
    }

    res.status(403).json({ success: false, message: 'Unauthorized' });
});

// 3. SAVE PROJECT
router.post('/admin/save', async (req, res) => {
    await connectDB();
    const token = req.headers['authorization'];
    const { key, data } = req.body;

    if (!ADMIN_KEYS.includes(token)) {
        return res.status(403).json({ success: false, message: 'Admins Only' });
    }

    const updateData = { ...data, key };
    await Project.findOneAndUpdate({ key }, updateData, { upsert: true, new: true });
    res.json({ success: true, message: 'Project Saved to Cloud' });
});

// 4. SUPPORT
router.post('/support', async (req, res) => {
    await connectDB();
    const { token, message, targetKey } = req.body; // Added targetKey for Admin replies

    // Check if Admin
    if (ADMIN_KEYS.includes(token)) {
        if (!targetKey) {
            return res.status(400).json({ success: false, message: 'Target Key Required for Admin' });
        }

        const project = await Project.findOne({ key: targetKey });
        if (project) {
            project.messages.push({
                sender: "iNEX Support", // Admin sender name
                text: message,
                date: new Date().toISOString()
            });
            await project.save();
            return res.json({ success: true, message: 'Reply Sent' });
        } else {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
    }

    // Client Logic
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

// Mount router at BOTH paths to work locally and on Netlify
app.use('/.netlify/functions/api', router); // For Netlify
app.use('/api', router);                    // For Local

// Export for Netlify
module.exports.handler = serverless(app);

// Keep local listening for testing
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.use(express.static(path.join(__dirname, 'public')));
    app.listen(PORT, () => console.log(`Local Server running at http://localhost:${PORT}`));
}
