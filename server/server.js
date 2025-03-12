require('dotenv').config(); // Load environment variables from .env
const cors = require('cors');
const express = require('express');

const app = express();

// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", // React app's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// Use middleware
app.use(cors(corsOptions)); // Apply CORS with the options
app.use(express.json()); // JSON parsing middleware

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`:::Server listening on port ${PORT}:::`);
});
