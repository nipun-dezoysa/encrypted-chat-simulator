import React, { createContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000/", {});

export const ChatContext = createContext({});

export function ChatContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);

  return (
    <ChatContext.Provider
      value={{ socket, user, setUser, contacts, setContacts }}
    >
      {children}
    </ChatContext.Provider>
  );
}
