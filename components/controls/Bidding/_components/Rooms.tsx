import { formalizeText, formatCurrency } from "@/lib/utils";
import { serialize } from "bson";
import { ChartCandlestick, ChartCandlestickIcon, HandshakeIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  currentUser: any
  socket: any
  rooms: any
  setExpectedKey: any
  animal: any
  isStaticStyle: boolean
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
      props.socket.emit("join-bidroom", serialize({ room, userId: props.currentUser.id }));
      props.setExpectedKey(room.key)
    }
  }

  const totalQuantity = Number(props.animal?.maleQuantityAvailable || 0) + Number(props.animal?.femaleQuantityAvailable || 0);

  return props.animal && <div>
    <div className="mb-5">
      {rooms && rooms?.length > 0 && <div className="tracking-tight text-xl">Please select a room for</div>}
      {props.animal && <Link href={`/entity/${props.animal.id}`} className="underline underline-offset-6 text-emerald-700">{formalizeText(props.animal.type)} {props.animal.breed} x {totalQuantity} @ {formatCurrency(props.animal.price)}</Link>}
    </div>
    {rooms && rooms.map((bid: any, index: number) => {

      if (props.isStaticStyle) {
        if (bid.animalId !== props.animal.id) {
          return null
        }
      }

      return (
        <div
          key={`${bid.id}-${index}`}
          onClick={() => handleJoinRoom(bid)}
          className="p-2 flex justify-between items-center border-b tracking-tight border-zinc-100 hover:bg-gradient-to-l hover:bg-zinc-100/70 to:bg-transparent cursor-pointer"
        >
          <div className="flex gap-1 items-center">{bid.userOfferAccepted ? <HandshakeIcon size={16} className="text-emerald-700" /> : <ChartCandlestickIcon className="text-amber-700" size={16} />}{bid.user.name}</div><div className={`${bid.closedAt && "font-semibold tracking-wider text-emerald-700"}`}>{bid.bids.length > 0 && formatCurrency(bid.bids[bid.bids.length - 1].price ?? 0)}</div>
        </div>
      );
    })}
  </div>
};

export default Rooms;
