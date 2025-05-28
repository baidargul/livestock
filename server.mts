import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3000;
const route = `http://${hostname}:${port}`;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    const currentUserId: any = socket.handshake.query.userId;
    const data = {
      connectionId: socket.id,
      userId: currentUserId,
    };
    fetch(`${route}/api/user/connections/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.info(
      `💻 A user '${currentUserId}' connected with connection id: ${
        socket.id
      } @ ${`${new Date().toDateString()} - ${new Date().toLocaleTimeString()}`}`
    );

    socket.on("join-bidroom", async ({ room }) => {
      if (room && room.key) {
        console.log(`Attempting to join room: ${room.key}`);
        try {
          const res = await fetch(`${route}/api/rooms/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room }),
          });

          const data = await res.json();
          if (data.status === 200 || data.status === 201) {
            console.log(`💻 Room created or already exists`);
            console.log(data.data);

            // Join the room
            socket.join(room.key);
            // Using io to broadcast all members in the room also the sender
            // we use socket only when to emit all except the sender
            io.to(room.key).emit("user-joined-bidroom", room);
          } else {
            console.error(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error(`Failed to process room join:`, error);
        }
      } else {
        console.error("Room key is missing or invalid");
      }
    });

    socket.on("disconnect", () => {
      fetch(`${route}/api/user/connections?connectionId=${socket.id}`, {
        method: "DELETE",
      });
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
