import app from '../src/app';
import connectDB from '../src/config/database';

// Connect to database (for Vercel serverless)
connectDB();

export default app;
