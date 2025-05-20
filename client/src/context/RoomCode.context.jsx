import React, { createContext, useContext, useState } from "react";

const RoomCodeContext = createContext();

export const RoomCodeProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState("");

  return (
    <RoomCodeContext.Provider value={{ roomCode, setRoomCode }}>
      {children}
    </RoomCodeContext.Provider>
  );
};

export const useRoomCode = () => useContext(RoomCodeContext);
