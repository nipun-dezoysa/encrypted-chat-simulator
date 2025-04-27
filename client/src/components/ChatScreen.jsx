import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContextProvider";
import Chat from "./Chat";
import ContactList from "./ContactList";
import { calCompuvate } from "../utils/calculations";

function ChatScreen() {
  const { socket, user, setContacts, contacts } = useContext(ChatContext);
  const [secret, setSecret] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    socket.on("sentreqres", (data) => {
      if (data) {
        if (data.error) {
          alert("User not found");
        } else {
          setContacts((prevContacts) => [
            ...prevContacts,
            {
              name: contact,
              secret: secret,
              myComputes: calCompuvate(secret),
              computes: null,
              key: null,
            },
          ]);
          // Reset the contact and secret states
          setContact("");
          setSecret("");
        }
      }
    });

    socket.on("request", (data) => {
      if (data) {
        const { computes, from } = data;
        setContacts((prevContacts) => {
          return [
            ...prevContacts,
            {
              name: from,
              computes: computes,
              key: null,
              secret: null,
              myComputes: null,
            },
          ];
        });
      }
    });

    // Cleanup the socket listener to avoid duplicate event handlers
    return () => {
      socket.off("sentreqres");
      socket.off("request");
    };
  }, [socket, contact, secret]);

  const handleRequest = (e) => {
    e.preventDefault();
    if (!contact || !secret) {
      alert("Please fill in both fields.");
      return;
    }
    if (user.name == contact) {
      alert("You cannot send a request to yourself.");
      return;
    }
    const existingContact = contacts.find(
      (c) => c.name === contact && c.secret === secret
    );
    if (existingContact) {
      alert("You have already sent a request to this contact.");
      return;
    }

    socket.emit("request", { computes: calCompuvate(secret), to: contact });
  };
  return (
    <div className="max-w-[700px] w-full flex flex-col gap-3">
      <div className="bg-white rounded-lg shadow-md flex overflow-hidden w-full p-3">
        User name: {user}
      </div>
      <div className="bg-white rounded-lg shadow-md flex overflow-hidden w-full">
        <div className="w-2/5  py-3 pl-3 flex flex-col gap-3">
          <ContactList />
          <form onSubmit={handleRequest} className="flex flex-col gap-1">
            <input
              type="text"
              required
              placeholder="Enter contact name"
              className="input-style w-full"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
            />
            <div className="flex gap-1">
              <input
                type="number"
                required
                placeholder="Enter a secret key"
                className="input-style w-full"
                onChange={(e) => setSecret(e.target.value)}
                value={secret}
              />
              <button type="submit" className="button-style">
                Request
              </button>
            </div>
          </form>
        </div>
        <div className="w-3/5 p-3">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden flex flex-col">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
