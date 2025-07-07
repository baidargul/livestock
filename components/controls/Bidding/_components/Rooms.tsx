import { calculatePricing, formalizeText, formatCurrency } from "@/lib/utils";
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
  expectedKey: string
};

const Rooms = (props: Props) => {
  const [rooms, setRooms] = useState<any>([])
  useEffect(() => {
    if (props.rooms) {
      setRooms([...props.rooms.myRooms, ...props.rooms.otherRooms].map((r: any) => {
        if (props.animal.id === r.animalId) {
          return r
        } else {
          return null
        }
      }))
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
      {props.animal && <Link href={`/entity/${props.animal.id}`} className="underline underline-offset-6 text-emerald-700">{totalQuantity} x {formalizeText(props.animal.breed)} {totalQuantity > 1 ? props.animal.type : props.animal.type.slice(0, props.animal.type.length - 1)} @ {formatCurrency(props.animal.price)} = {calculatePricing(props.animal).price}</Link>}
    </div>
    {rooms && rooms.map((bid: any, index: number) => {

      if (!bid) return

      if (props.isStaticStyle) {
        if (bid.animalId !== props.animal.id) {
          return null
        }
      }

      return (
        <div
          key={`${bid.id}-${index}`}
          onClick={() => handleJoinRoom(bid)}
          className={`p-2 ${props.expectedKey === bid.key ? "scale-75 pointer-events-none opacity-50" : ""} transition-all duration-100 ease-in-out flex justify-between items-center border-b tracking-tight border-zinc-100 hover:bg-gradient-to-l hover:bg-zinc-100/70 to:bg-transparent cursor-pointer`}
        >
          <div className="flex gap-4 items-center">
            {bid.userOfferAccepted ? <HandshakeIcon size={16} className="text-emerald-700" /> : <ChartCandlestickIcon className="text-amber-700" size={16} />}
            <div>
              <div>
                {bid.user.name}
              </div>
              <div className="text-xs tracking-wide -mt-1">
                {bid.maleQuantityAvailable && bid.maleQuantityAvailable > 0 && `${bid.maleQuantityAvailable} male,`} {bid.femaleQuantityAvailable && bid.femaleQuantityAvailable > 0 && `${bid.femaleQuantityAvailable} female`} - {bid.deliveryOptions.map((option: any) => option).join(", ")}
              </div>
            </div>
          </div>
          <div className={`${bid.closedAt && "font-semibold tracking-wider text-emerald-700"}`}>{bid.userOfferAccepted ? formatCurrency(bid.closedAmount) : formatCurrency(bid.bids[bid.bids.length - 1].price ?? 0)}

          </div>
        </div>
      );
    })}
  </div>
};

export default Rooms;
