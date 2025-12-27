/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import config from "./config";
import connectDB from "./config/database";

dotenv.config();

async function main() {
  await connectDB();

  const server: Server = app.listen(config.port, () => {
    console.log("Server is running on port ", config.port);
  });
}

main();
