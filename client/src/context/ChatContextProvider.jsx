import React, { createContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000/", {});

export const ChatContext = createContext({});

export function ChatContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);

  const addMessage = (contactName, message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [contactName]: [...(prevMessages[contactName] || []), message],
    }));
  };
  return (
    <ChatContext.Provider
      value={{
        socket,
        user,
        setUser,
        contacts,
        setContacts,
        messages,
        selectedContact,
        setSelectedContact,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
