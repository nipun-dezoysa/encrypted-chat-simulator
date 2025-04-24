import React, { createContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000/", {});

export const ChatContext = createContext({});

export function ChatContextProvider({ children }) {
  useEffect(() => {}, [socket]);

  return (
    <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>
  );
}
