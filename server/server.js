import dotenv from 'dotenv'; // Load environment variables from .env
import appointmentRoutes from './routes/appointments.js';
import cors from 'cors';
// import crypto from 'crypto'
import express from 'express';
// import session from 'express-session';
import { listenSub } from './services/appointments.js';

dotenv.config();
// const secret = crypto.randomBytes(64).toString('hex');  // Generates a random 64-byte hex string
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
// app.use(session({
//     secret: secret, // Replace this with a secure secret key
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }  // Use true if you're using HTTPS
//   }));

const PORT = process.env.PORT || 5000;
const subscription = 'consultations_sub';
const timeout = 30;

app.use('/api/appointments', appointmentRoutes);

app.listen(PORT, () => {
    console.log(`:::Server listening on port ${PORT}:::`);
    listenSub(subscription, timeout); // Important HAHAHA, this will be ran in the individual reddis machine.
});
