import { formatCurrency } from "@/lib/utils";
import { ChartCandlestick, ChartCandlestickIcon, HandshakeIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  currentUser: any
  socket: any
  rooms: any
  setExpectedKey: any
};

const Rooms = (props: Props) => {
  const [rooms, setRooms] = useState<any>([])

  useEffect(() => {
    if (props.rooms) {
      setRooms([...props.rooms.myRooms, ...props.rooms.otherRooms])
    }
  }, [props.rooms])

  const handleJoinRoom = (bidRoom: any) => {
    if (props.currentUser && props.socket) {
      const room = {
        animalId: bidRoom.animalId,
        authorId: bidRoom.authorId,
        userId: bidRoom.userId,
        key: `${bidRoom.key}`,
      }
      props.socket.emit("join-bidroom", { room, userId: props.currentUser.id });
      props.setExpectedKey(room.key)
    }
  }

  return rooms && rooms.map((bid: any, index: number) => {
    return (
      <div
        key={`${bid.id}-${index}`}
        onClick={() => handleJoinRoom(bid)}
        className="p-2 flex justify-between items-center border-b tracking-tight border-zinc-100 hover:bg-gradient-to-l hover:bg-zinc-100/70 to:bg-transparent cursor-pointer"
      >
        <div className="flex gap-1 items-center">{bid.closedAt ? <HandshakeIcon size={16} className="text-emerald-700" /> : <ChartCandlestickIcon className="text-amber-700" size={16} />}{bid.user.name}</div><div className={`${bid.closedAt && "font-semibold tracking-wider text-emerald-700"}`}>{bid.bids.length > 0 && formatCurrency(bid.bids[bid.bids.length - 1].price ?? 0)}</div>
      </div>
    );
  });
};

export default Rooms;
