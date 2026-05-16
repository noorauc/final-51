require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// FIX: Changed './schemas' to './Schemas' to resolve case-sensitivity loading failures
const { User, Destination } = require('./Schemas');
const { logger } = require('./auth');

const app = express();

// Global Middleware Stack
app.use(express.json());
app.use(cors());
app.use(logger);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/travelmate";
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "travel_mate_ultra_secret_key_123";

// Connect to MongoDB Database
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log(">>> [SUCCESS] Connected securely to MongoDB Database Instance.");
        await seedDatabase();
    })
    .catch(err => console.error(">>> [CRITICAL ERROR] Database connection failed:", err));

// Database Automatic Seeder Engine
async function seedDatabase() {
    try {
        const count = await Destination.countDocuments();
        if (count === 0) {
            console.log("[Seeder] Destinations collection is empty. Populating dataset documents...");
            const initialDestinations = [
                {
                    "id": "bali",
                    "title": "Ubud Wellness Retreat",
                    "desc": "Experience the spiritual heart of Bali with private jungle villas and traditional holistic healing.",
                    "img": "bali.webp",
                    "weather": "Humid 30°C",
                    "dining": "Locavore",
                    "season": "April - October"
                },
                {
                    "id": "egypt",
                    "title": "The Eternal Nile",
                    "desc": "A journey through time featuring private tours of the Giza Pyramids and luxury Nile cruises.",
                    "img": "egypt.jpg",
                    "weather": "Dry 35°C",
                    "dining": "1886 Restaurant",
                    "season": "October - April"
                },
                {
                    "id": "santorini",
                    "title": "Oia Sunset Escape",
                    "desc": "Iconic white-washed architecture overlooking the Aegean Sea with world-class cave suites.",
                    "img": "santorini.jpg",
                    "weather": "Sunny 28°C",
                    "dining": "Ambrosia",
                    "season": "May - September"
                },
                {
                    "id": "safari",
                    "title": "Serengeti Luxury Safari",
                    "desc": "Unparalleled wildlife viewing from the comfort of high-end canvas tents under the stars.",
                    "img": "safari.webp",
                    "weather": "Mild 24°C",
                    "dining": "Bush Dinner",
                    "season": "June - October"
                },
                {
                    "id": "cappadocia",
                    "title": "Anatolian Skies",
                    "desc": "Wake up to hundreds of hot air balloons over the 'Fairy Chimneys' in historical cave dwellings.",
                    "img": "cappadocia.webp",
                    "weather": "Breezy 22°C",
                    "dining": "Seki Restaurant",
                    "season": "April - June"
                },
                {
                    "id": "mediterranean",
                    "title": "Amalfi Coast Drive",
                    "desc": "Winding coastal roads, lemon groves, and historic villas perched on dramatic cliffs.",
                    "img": "mediterranean.jpg",
                    "weather": "Warm 26°C",
                    "dining": "La Sponda",
                    "season": "May - September"
                }
            ];
            await Destination.insertMany(initialDestinations);
            console.log(">>> [SUCCESS] All travel documents successfully seeded into MongoDB.");
        } else {
            console.log(`[Seeder] Destination collection records verified: ${count} documents detected.`);
        }
    } catch (error) {
        console.error("Auto-seeding validation error context:", error);
    }
}

// Authentication Endpoint: Issue Secure JWT String 
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!email || !username) {
            return res.status(400).json({ error: "Missing required identification payload fields." });
        }

        let user = await User.findOne({ email });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ username, email, password: hashedPassword });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
        console.error("Auth server exception:", error);
        res.status(500).json({ error: "Internal Authentication Module Defect" });
    }
});

// Destination Endpoint: Fetch Dynamic Collections for the Frontend UI
app.get('/api/destinations', async (req, res) => {
    try {
        const data = await Destination.find({});
        res.status(200).json(data);
    } catch (error) {
        console.error("Database parsing readout failure:", error);
        res.status(500).json({ error: "Failed to read documents from cluster collections." });
    }
});

app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` SERVER RUNNING SUCCESSFULLY ON PORT: ${PORT}      `);
    console.log(` Endpoints Available at http://localhost:${PORT}   `);
    console.log(`=================================================`);
});