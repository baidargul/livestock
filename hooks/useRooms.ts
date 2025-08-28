import { actions } from "@/actions/serverActions/actions";
import { bidsReverse } from "@/components/controls/Bidding/BiddingWrapper";
import { create } from "zustand";

interface Room {
  key: string; // Unique identifier for the room
  authorId: string; // ID of the user who created the room
  // Add additional properties of the room as needed
}

interface User {
  id: string; // Unique identifier for the user
  // Add additional properties of the user as needed
}

interface RoomsState {
  rooms: {
    myRooms: Room[]; // Array of rooms created by the current user
    otherRooms: Room[]; // Array of rooms created by other users
  };
  isFetching: boolean;
  getRooms: () => { myRooms: Room[]; otherRooms: Room[] }; // Function to retrieve all rooms
  addRoom: (room: Room, currentUser: User) => void; // Function to add a room
  removeRoom: (roomKey: string) => void; // Function to remove a room by key
  getLatestRooms: (userId: string) => Promise<void>; // Function to fetch the latest rooms for a user
  find: (animalId: string, id: string, key: "userId" | "authorId") => any;
}

export const useRooms: any = create<RoomsState>()((set) => ({
  rooms: {
    myRooms: [],
    otherRooms: [],
  },
  isFetching: false,
  getRooms: () => {
    const { rooms } = useRooms.getState();
    return { ...rooms };
  },
  addRoom: (room, currentUser) => {
    if (currentUser.id === room.authorId) {
      set((state) => {
        if (state.rooms.myRooms.find((r) => r.key === room.key)) {
          let newRoom = state.rooms.myRooms.find((r) => r.key === room.key);
          newRoom = { ...newRoom, ...room };
          return {
            rooms: {
              ...state.rooms,
              myRooms: [
                ...state.rooms.myRooms.filter((r) => r.key !== room.key),
                newRoom,
              ],
            },
          };
        }
        return {
          rooms: { ...state.rooms, myRooms: [...state.rooms.myRooms, room] },
        };
      });
    } else {
      set((state) => {
        if (state.rooms.otherRooms.find((r) => r.key === room.key)) {
          let newRoom = state.rooms.otherRooms.find((r) => r.key === room.key);
          newRoom = { ...newRoom, ...room };
          return {
            rooms: {
              ...state.rooms,
              otherRooms: [
                ...state.rooms.otherRooms.filter((r) => r.key !== room.key),
                newRoom,
              ],
            },
          };
        }
        return {
          rooms: {
            ...state.rooms,
            otherRooms: [...state.rooms.otherRooms, room],
          },
        };
      });
    }
  },
  removeRoom: (roomKey) => {
    set((state) => {
      const updatedMyRooms = state.rooms.myRooms.filter(
        (room) => room.key !== roomKey
      );
      const updatedOtherRooms = state.rooms.otherRooms.filter(
        (room) => room.key !== roomKey
      );

      return {
        rooms: {
          myRooms: updatedMyRooms,
          otherRooms: updatedOtherRooms,
        },
      };
    });
  },

  getLatestRooms: async (userId: string) => {
    useRooms.setState({ isFetching: true });
    const response = await actions.client.bidRoom.listByUser(userId, null, 5);
    if (response.status === 200) {
      const { myRooms, otherRooms } = response.data;
      for (const i in myRooms) {
        myRooms[i].bids = bidsReverse(myRooms[i].bids);
      }
      for (const i in otherRooms) {
        otherRooms[i].bids = bidsReverse(otherRooms[i].bids);
      }
      set({
        rooms: {
          myRooms: myRooms || [],
          otherRooms: otherRooms || [],
        },
        isFetching: false,
      });
    }
  },
  find: (animalId: string, id: string, key: "userId" | "authorId") => {
    const { rooms } = useRooms.getState();
    const mergedRooms = [...rooms.myRooms, ...rooms.otherRooms];
    return mergedRooms.find(
      (room) => room[key] === id && room.animalId === animalId
    );
  },
  clearRooms: () => set({ rooms: { myRooms: [], otherRooms: [] } }),
}));
