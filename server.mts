import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.info(
      `💻 A user connected: ${
        socket.id
      } @ ${`${new Date().toDateString()} - ${new Date().toLocaleTimeString()}`}`
    );

    socket.on("join-bidroom", ({ room, userId }) => {
      socket.join(room.key);
      console.info(`💻 User ${userId} joined bidroom: ${room.key}`);
      socket.to(room).emit("user-joined-bidroom", room);
    });

    socket.on("disconnect", () => {
      console.info(
        `💻 A user disconnected: ${
          socket.id
        } @ ${`${new Date().toDateString()} - ${new Date().toLocaleTimeString()}`}`
      );
    });

    // Add more event listeners as needed
  });

  httpServer.listen(port, () => {
    console.log(`>✅ Socket Server Ready on http://${hostname}:${port}`);
  });
});
