import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

const connectDB = async (): Promise<typeof mongoose> => {
  const mongoURI = process.env.MONGODB_URI || "";

  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (
    process.env.NODE_ENV === "production" &&
    (mongoURI.includes("localhost") || mongoURI.includes("127.0.0.1"))
  ) {
    throw new Error(
      "Production cannot use local MongoDB. Set MONGODB_URI to a MongoDB Atlas connection string on Vercel.",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
