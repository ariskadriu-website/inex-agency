/**
 * MOCK DATABASE
 * -------------
 * Map Access Keys to Project Data.
 * 
 * Structure:
 * "KEY": {
 *    name: "Project Name",
 *    phase: "Current Phase",
 *    status: "On Track" | "Delayed" | "Completed",
 *    milestone: "Next Milestone",
 *    milestoneDate: "Due Date",
 *    timeline: [
 *       { title: "Stage Name", date: "Date Range", completed: true/false }
 *    ],
 *    invoices: [
 *       { id: "INV-001", date: "Jan 1, 2026", amount: "€1,000", status: "Paid" }
 *    ]
 * }
 */

// 1. Define Default Data (The "Seed")
const DEFAULT_DB = {
    // 1. DEMO USER
    'DEMO-USER': {
        name: "Demo Project Alpha",
        phase: "Development",
        status: "On Track",
        milestone: "Beta Launch",
        milestoneDate: "Feb 15, 2026",
        timeline: [
            { title: "Discovery", date: "Jan 01 - Jan 05", completed: true },
            { title: "Design", date: "Jan 06 - Jan 12", completed: true },
            { title: "Development", date: "In Progress", completed: false },
            { title: "Testing", date: "Upcoming", completed: false }
        ],
        invoices: [
            { id: "INV-2026-001", date: "Jan 01, 2026", amount: "€1,200", status: "Paid" },
            { id: "INV-2026-002", date: "Jan 15, 2026", amount: "€1,200", status: "Pending" }
        ]
    },

    // 2. PROJECT AETHER
    'PROJECT-AETHER': {
        name: "Project Aether",
        phase: "Final QA",
        status: "Completed",
        milestone: "Live Launch",
        milestoneDate: "Jan 30, 2026",
        timeline: [
            { title: "Discovery", date: "Dec 01", completed: true },
            { title: "Design", date: "Dec 15", completed: true },
            { title: "Dev", date: "Jan 10", completed: true },
            { title: "QA", date: "Jan 25", completed: true }
        ],
        invoices: [
            { id: "INV-AE-01", date: "Dec 01, 2025", amount: "€5,000", status: "Paid" },
            { id: "INV-AE-02", date: "Jan 01, 2026", amount: "€5,000", status: "Paid" }
        ]
    }
};

// 2. Admin Keys (Array for multiple admins)
const ADMIN_KEYS = [
    "INEX-ARISIADMIN",
    "INEX-JONIADMIN"
];

// 3. Encryption System "INEX-GUARD"
const ENCRYPTION_KEY = "INEX_SECRET_KEY_2026"; // Internal key

const InexGuard = {
    encrypt: function (data) {
        const text = JSON.stringify(data);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
        }
        return btoa(result); // Convert to Base64 for safe storage
    },

    decrypt: function (cipher) {
        try {
            const text = atob(cipher);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
            }
            return JSON.parse(result);
        } catch (e) {
            console.error("Tampering detected or Key mismatch. Resetting DB.");
            return null;
        }
    }
};

// 4. Initialize DB (Load Securely)
let rawData = localStorage.getItem('INEX_DB_V1');
let CLIENT_DB;

if (rawData) {
    // Attempt to decrypt
    // If it looks like JSON (old format), migrate it. IF not, decrypt.
    if (rawData.trim().startsWith('{')) {
        console.log("Migrating legacy data to encrypted format...");
        CLIENT_DB = JSON.parse(rawData);
        saveDatabase(CLIENT_DB); // Immediately encrypt
    } else {
        CLIENT_DB = InexGuard.decrypt(rawData);
    }
}

// Fallback if decryption failed or no data
if (!CLIENT_DB) {
    CLIENT_DB = DEFAULT_DB;
}

// Helper function to save changes (Encrypts before saving)
function saveDatabase(newDb) {
    CLIENT_DB = newDb;
    const encrypted = InexGuard.encrypt(newDb);
    localStorage.setItem('INEX_DB_V1', encrypted);
    console.log("Database Encrypted & Saved!");
}
