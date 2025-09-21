import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { deserialize, serialize } from "bson";
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3000;
const route = `http://${hostname}:${port}`;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  setInterval(() => {
    const used = process.memoryUsage();
    console.log(`SOCKET MEMORY: ${Math.round(used.rss / 1024 / 1024)}MB`);
  }, 5000);

  io.on("connection", (socket) => {
    const diagnostics = {
      eventCount: 0,
      lastEvent: null,
    };

    socket.onAny((event, ...args) => {
      diagnostics.eventCount++;
      diagnostics.lastEvent = { event, args: args.length };

      if (diagnostics.eventCount % 100 === 0) {
        console.log(`[DIAG] Events/sec: ${calculateRate()}`);
        console.log(
          `[DIAG] Memory: ${process.memoryUsage().rss / 1024 / 1024}MB`
        );
      }
    });

    const currentUserId = socket.handshake.query.userId;
    const data = {
      connectionId: socket.id,
      userId: currentUserId,
    };
    fetch(`${route}/api/user/connections/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    socket.on("place-bid", async (binaryData) => {
      const { roomKey, userId, amount } = deserialize(binaryData);
      try {
        const res = await fetch(`${route}/api/rooms/bid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomKey, userId, amount: amount }),
        });
        const data = await res.json();
        if (data.status === 200) {
          socket.join(roomKey);
          socket.emit(
            "bid-placed",
            serialize({
              room: data.data,
              userId: userId,
            })
          );
          for (const ids of data.data.author.connectionIds) {
            io.to(ids).emit(
              "bid-placed",
              serialize({
                room: data.data,
                userId: userId,
              })
            );
          }
          for (const ids of data.data.user.connectionIds) {
            io.to(ids).emit(
              "bid-placed",
              serialize({
                room: data.data,
                userId: userId,
              })
            );
          }
        } else if (data.status === 302) {
          socket.emit("low-balance");
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("close-deal", async (binaryData) => {
      const { room, userId, bid } = deserialize(binaryData);
      try {
        const res = await fetch(`${route}/api/rooms/bid/close`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room, userId, bid }),
        });
        const data = await res.json();
        if (data.status === 200) {
          socket.join(room.key);
          if (data.data.closedAt && String(data.data.closedAt).length > 0) {
            io.emit(
              "sold",
              serialize({ animalId: data.data.room.animalId, room: room })
            );
          }
          socket.emit(
            "deal-closed",
            serialize({
              room: data.data,
              userId: userId,
            })
          );
          socket.to(room.key).emit(
            "deal-closed",
            serialize({
              room: data.data,
              userId: userId,
            })
          );
          for (const ids of data.data.author.connectionIds) {
            io.to(ids).emit(
              "deal-closed",
              serialize({
                room: data.data,
                userId: userId,
              })
            );
          }
          for (const ids of data.data.user.connectionIds) {
            io.to(ids).emit(
              "deal-closed",
              serialize({
                room: data.data,
                userId: userId,
              })
            );
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("lock-bid-as-final-offer", async (binaryData) => {
      const { bid, userId } = deserialize(binaryData);
      try {
        const res = await fetch(`${route}/api/rooms/bid/lock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bid, userId }),
        });
        const data = await res.json();
        if (data.status === 200) {
          for (const ids of data.data.data.author.connectionIds) {
            io.to(ids).emit(
              "bid-locked-as-final-offer",
              serialize({
                room: data.data.data,
                userId: userId,
              })
            );
          }
          for (const ids of data.data.data.user.connectionIds) {
            io.to(ids).emit(
              "bid-locked-as-final-offer",
              serialize({
                room: data.data.data,
                userId: userId,
              })
            );
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("message-seen", async (binaryData) => {
      const { bidId, room } = deserialize(binaryData);
      try {
        const res = await fetch(`${route}/api/rooms/bid/seen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bidId }),
        });
        const data = await res.json();
        if (data.status === 200) {
          socket.join(room.key);
          io.to(room.key).emit(
            "message-is-seen",
            serialize({
              room: room,
              bidId: bidId,
            })
          );
          if (data.data.connectionIds) {
            for (const ids of data.data.connectionIds) {
              socket.to(ids).emit(
                "message-is-seen",
                serialize({
                  room: room,
                  bidId: bidId,
                })
              );
            }
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    });
    socket.on("join-bidroom", async (binaryData) => {
      const { room, userId, demandId } = deserialize(binaryData);
      if (room && room.key) {
        try {
          const res = await fetch(`${route}/api/rooms/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room, userId, demandId }),
          });

          const data = await res.json();
          if (data.status === 200 || data.status === 201) {
            //telling about this to all the instances of this author
            for (const ids of data.data.author.connectionIds) {
              io.to(ids).emit(
                "user-joined-bidroom",
                serialize({
                  room: data.data,
                  userId: userId,
                })
              );
            }
            //telling about this to all the instances of this user
            for (const ids of data.data.user.connectionIds) {
              io.to(ids).emit(
                "user-joined-bidroom",
                serialize({
                  room: data.data,
                  userId: userId,
                })
              );
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
    socket.on("leave-bidroom", async (binaryData) => {
      const { room, userId } = deserialize(binaryData);
      if (room && room.key) {
        const res = await fetch(`${route}/api/rooms`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room, userId }),
        });
        const data = await res.json();
        if (data.status === 200) {
          socket.rooms.forEach(() => socket.leave(room.key));
          //telling about this to all the instances of this author
          for (const ids of data.data.author.connectionIds) {
            io.to(ids).emit(
              "user-left-bidroom",
              serialize({
                room: data.data,
                userId: userId,
              })
            );
          }
          for (const ids of data.data.user.connectionIds) {
            io.to(ids).emit(
              "user-left-bidroom",
              serialize({
                room: data.data,
                userId: userId,
              })
            );
          }
        } else {
          console.error(`Error: ${data.message}`);
        }
      }
    });
    socket.on("close-bidroom", async (binaryData) => {
      const { room, userId } = deserialize(binaryData);
      if (room && room.key) {
        try {
          const res = await fetch(
            `${route}/api/rooms?value=${room.key}&key=key&userId=${userId}`,
            {
              method: "DELETE",
            }
          );
          const data = await res.json();
          if (data.status === 200) {
            socket.emit(
              "room-closed",
              serialize({
                room: data.data,
                userId: userId,
              })
            );
            const userConnections = data.data.user.connectionIds;
            const authorConnections = data.data.author.connectionIds;
            [...userConnections, ...authorConnections].forEach((id) => {
              io.to(id).emit(
                "room-closed",
                serialize({
                  room: data.data,
                  userId: userId,
                })
              );
            });
            socket.rooms.forEach((room) => socket.leave(room));
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
        io.emit(
          "user-left-bidroom",
          serialize({ room: null, userId: data.data.id })
        );
      }
      console.info(
        `💻 A user disconnected: ${
          socket.id
        } @ ${`${new Date().toDateString()} - ${new Date().toLocaleTimeString()}`}`
      );
      [
        "place-bid",
        "close-deal",
        "lock-bid-as-final-offer",
        "message-seen",
        "join-bidroom",
        "leave-bidroom",
        "close-bidroom",
      ].forEach((event) => socket.removeAllListeners(event));
    });
    // Add more event listeners as needed
  });

  httpServer.listen(port, async () => {
    console.log(`>✅ Socket Server Ready on http://${hostname}:${port}`);
    // RESETTING CONNECTIONS FOR EACH USER
    console.log(`RESETTING CONNECTIONS FOR EACH USER`);
    fetch(`${route}/api/rooms/connections/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    // INITIALIZING PROTOCOLS
    console.log(`INITIALIZING PROTOCOLS`);
    fetch(`${route}/api/server/initialize/`);
  });
});
