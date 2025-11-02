import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  env: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};
