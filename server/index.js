import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from './routers/students.js';
import commentRoutes from './routers/comments.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://mark-management-system-4wvt.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
