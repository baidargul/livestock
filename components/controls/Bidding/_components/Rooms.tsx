import React from "react";

type Props = {
  currentUser: any
  socket: any
  rooms: any[];
};

const Rooms = (props: Props) => {

  const handleJoinRoom = (bidRoom: any) => {
    if (props.currentUser && props.socket) {
      const room = {
        animalId: bidRoom.animalId,
        authorId: bidRoom.authorId,
        userId: bidRoom.userId,
        key: `${bidRoom.key}`,
      }
      props.socket.emit("join-bidroom", { room, userId: props.currentUser.id });
    }
  }

  return props.rooms.map((bid: any, index: number) => {
    return (
      <div
        key={`${bid.id}-${index}`}
        onClick={() => handleJoinRoom(bid)}
        className="p-2 border-b tracking-tight border-zinc-100 hover:bg-gradient-to-l hover:bg-zinc-100/70 to:bg-transparent cursor-pointer"
      >
        {bid.user.name} {bid.bids.length > 0 && bid.bids[bid.length - 1]?.price}
      </div>
    );
  });
};

export default Rooms;
