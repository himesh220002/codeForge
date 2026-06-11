import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ownershipRoutes from "./routes/ownershipRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Custom cookie parsing middleware to support HttpOnly cookie checks without external package dependencies
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const [key, value] = cookie.split('=').map((c) => c.trim());
      if (key && value) {
        req.cookies[key] = value;
      }
    });
  }
  next();
});


// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/ownership", ownershipRoutes);

app.use("/api/contact", contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ats", atsRoutes);


app.get('/', (req, res) => {
    res.send('Express server is running!');
});

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`);
    });
});
