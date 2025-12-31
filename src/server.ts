import "dotenv/config";
import { Server } from "http";
import app from "./app";
import config from "./config";
import connectDB from "./config/database";

console.log(
  "Environment check - Google Client ID exists:",
  !!(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID)
);

async function main() {
  await connectDB();

  const server: Server = app.listen(config.port, () => {
    console.log("Server is running on port ", config.port);
  });

  const { initializeSocket } = require("./services/socket.services");
  initializeSocket(server);
}

main();
