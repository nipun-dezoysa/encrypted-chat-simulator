import React, { createContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { calKey } from "../utils/calculations";
import { decrypt } from "../utils/ciphers";
const socket = io("http://localhost:5000/", {});

export const ChatContext = createContext({});

export function ChatContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);

  const addMessage = (contactName, message, encrypt, sent) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [contactName]: [
        ...(prevMessages[contactName] || []),
        { message, sent, encrypt },
      ],
    }));
  };

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (!msg) return;
      const { from, message, iv } = msg;
      const key = contacts.find((contact) => contact.name === from)?.key;
      const decryptedMessage = decrypt(message, key, iv);
      addMessage(from, decryptedMessage, message, false);
    });

    socket.on("accept_request", (data) => {
      if (data) {
        const { computes, from } = data;
        // Update the selected contact with the computes value
        if (selectedContact) {
          setSelectedContact((prevContact) => {
            return {
              ...prevContact,
              computes: computes,
              key: calKey(selectedContact.secret, computes),
            };
          });
        }
        setContacts((prevContacts) => {
          return prevContacts.map((contact) => {
            if (contact.name === from) {
              return {
                ...contact,
                computes: computes,
                key: calKey(contact.secret, computes),
              };
            }
            return contact;
          });
        });
      }
    });

    socket.on("user_disconnected", (user) => {
      if (selectedContact && selectedContact.name === user) {
        setSelectedContact(null);
      }
      setContacts((prevContacts) => {
        return prevContacts.filter((contact) => contact.name !== user);
      });
    });

    return () => {
      socket.off("receive_message");
      socket.off("accept_request");
      socket.off("user_disconnected");
    };
  }, [selectedContact, socket]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        user,
        setUser,
        contacts,
        setContacts,
        messages,
        addMessage,
        selectedContact,
        setSelectedContact,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
