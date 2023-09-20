import app from "./app.js";
const port = process.env.PORT || 8000;
import { connectDB } from "./config/database.js";
import http from "http";
import configureSocket from "./config/socket.js";

// Connect to database
connectDB();

const server = http.createServer(app);

const io = configureSocket(server);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
