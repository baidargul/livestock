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
  getRooms: () => { myRooms: Room[]; otherRooms: Room[] }; // Function to retrieve all rooms
  addRoom: (room: Room, currentUser: User) => void; // Function to add a room
  removeRoom: (roomKey: string) => void; // Function to remove a room by key
}

export const useRooms: any = create<RoomsState>()((set) => ({
  rooms: {
    myRooms: [],
    otherRooms: [],
  },
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
}));
