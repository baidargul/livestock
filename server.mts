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

    socket.on("place-bid", async ({ roomKey, userId, amount }) => {
      console.log(
        `'${userId}' want to placebid of ${amount} in room: ${roomKey}`
      );
      try {
        const res = await fetch(`${route}/api/rooms/bid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomKey, userId, amount: amount }),
        });
        const data = await res.json();
        if (data.status === 200) {
          console.log(`💻 Bid placed successfully`);
          socket.join(roomKey);
          io.to(roomKey).emit("bid-placed", {
            room: data.data,
            userId: userId,
          });
          for (const ids of data.data.author.connectionIds as string[]) {
            console.log(`telling ${ids} about this`);
            io.to(ids).emit("bid-placed", {
              room: data.data,
              userId: userId,
            });
          }
          for (const ids of data.data.user.connectionIds as string[]) {
            console.log(`telling ${ids} about this`);
            io.to(ids).emit("bid-placed", {
              room: data.data,
              userId: userId,
            });
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("close-deal", async ({ room, userId, bid }) => {
      console.log(
        `'${userId}' want to close deal in room: ${room.key} at ${bid.price}`
      );
      try {
        const res = await fetch(`${route}/api/rooms/bid/close`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room, userId, bid }),
        });
        const data = await res.json();
        if (data.status === 200) {
          console.log(`💻 Deal closed successfully`);
          socket.join(room.key);
          io.to(room.key).emit("deal-closed", {
            room: data.data.room,
            bid: data.data.bid,
          });
          for (const ids of data.data.author.connectionIds as string[]) {
            console.log(`telling ${ids} about this`);
            io.to(ids).emit("deal-closed", {
              room: data.data,
              userId: userId,
            });
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("lock-bid-as-final-offer", async ({ roomId, userId }) => {
      console.log(
        `'${userId}' want to lock bid as final offer in room: ${roomId}`
      );
      try {
        const res = await fetch(`${route}/api/rooms/bid/lock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, userId }),
        });
        const data = await res.json();
        if (data.status === 200) {
          console.log(`💻 Last Bid locked as final offer successfully`);
          socket.join(data.data.key);
          io.to(data.data.key).emit("bid-locked-as-final-offer", {
            room: data.data.data,
            userId: userId,
          });
          for (const ids of data.data.author.connectionIds as string[]) {
            console.log(`telling ${ids} about this`);
            io.to(ids).emit("bid-locked-as-final-offer", {
              room: data.data,
              userId: userId,
            });
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("message-seen", async ({ bidId, room }) => {
      console.log(`Message seen: ${bidId} in Room ${room.key}`);
      try {
        const res = await fetch(`${route}/api/rooms/bid/seen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bidId }),
        });
        const data = await res.json();
        if (data.status === 200) {
          socket.join(room.key);
          io.to(room.key).emit("message-is-seen", {
            room: room,
            bidId: bidId,
          });
          if (data.data.connectionIds) {
            for (const ids of data.data.connectionIds as string[]) {
              console.log(`telling ${ids} about this`);
              io.to(ids).emit("message-is-seen", {
                room: room,
                bidId: bidId,
              });
            }
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("join-bidroom", async ({ room, userId }) => {
      if (room && room.key) {
        console.log(`${userId} attempting to join room: ${room.key}`);
        try {
          const res = await fetch(`${route}/api/rooms/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room, userId }),
          });

          const data = await res.json();
          if (data.status === 200 || data.status === 201) {
            console.log(`💻 Room created or already exists`);
            console.log(data.data);

            // Join the room
            socket.join(room.key);
            // Using io to broadcast all members in the room also the sender
            // we use socket only when to emit all except the sender
            io.to(room.key).emit("user-joined-bidroom", {
              room: data.data,
              userId: userId,
            });

            //telling about this to all the instances of this author
            for (const ids of data.data.author.connectionIds as string[]) {
              console.log(`telling ${ids} about this`);
              io.to(ids).emit("user-joined-bidroom", {
                room: data.data,
                userId: userId,
              });
            }
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
    socket.on("leave-bidroom", async ({ room, userId }) => {
      if (room && room.key) {
        console.log(`${userId} attempting to leave room: ${room.key}`);
        const res = await fetch(`${route}/api/rooms`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room, userId }),
        });
        const data = await res.json();
        if (data.status === 200) {
          socket.rooms.forEach(() => socket.leave(room.key));
          console.log(`💻 Room left successfully`);
          io.to(room.key).emit("user-left-bidroom", {
            room: data.data,
            userId: userId,
          });

          //telling about this to all the instances of this author
          for (const ids of data.data.author.connectionIds as string[]) {
            console.log(`telling ${ids} about this`);
            io.to(ids).emit("user-left-bidroom", {
              room: data.data,
              userId: userId,
            });
          }
        } else {
          console.error(`Error: ${data.message}`);
        }
      }
    });
    socket.on("close-bidroom", async ({ room }) => {
      if (room && room.key) {
        console.log(`Attempting to close room: ${room.key}`);
        try {
          const res = await fetch(
            `${route}/api/rooms?value=${room.key}&key=key`,
            {
              method: "DELETE",
            }
          );
          const data = await res.json();
          if (data.status === 200) {
            socket.rooms.forEach((room) => socket.leave(room));
            console.log(`💻 Room closed successfully`);
            console.log(data.data);
          } else {
            console.error(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error(`Failed to process room close:`, error);
        }
      }
    });
    socket.on("disconnect", async () => {
      const response = await fetch(
        `${route}/api/user/connections?connectionId=${socket.id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.status === 200) {
        io.emit("user-left-bidroom", { room: null, userId: data.data.id });
      }
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
