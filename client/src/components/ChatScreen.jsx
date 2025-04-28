import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContextProvider";
import Chat from "./Chat";
import ContactList from "./ContactList";
import { baseNum, calCompuvate, modulusNum } from "../utils/calculations";

function ChatScreen() {
  const { socket, user, setContacts, contacts, selectedContact } =
    useContext(ChatContext);
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
    const existingContact = contacts.find((c) => c.name === contact);
    if (existingContact) {
      alert("You have already sent a request to this contact.");
      return;
    }

    socket.emit("request", { computes: calCompuvate(secret), to: contact });
  };
  return (
    <div className="max-w-[700px] w-full max-md:h-svh flex flex-col gap-3">
      <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center md:justify-between overflow-hidden w-full p-3">
        <div>
          User name: <span className="font-bold">{user}</span>
        </div>
        <div className="flex gap-5">
          <div>
            Base Value: <span className="font-bold">{baseNum}</span>
          </div>
          <div>
            Modulus Value: <span className="font-bold">{modulusNum}</span>
          </div>
        </div>
      </div>
      <div className="bg-white relative rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden w-full max-md:flex-1 md:h-[500px]">
        <div
          className={`md:w-2/5 max-md:absolute top-0 w-full bg-white h-full py-3 pl-3 max-md:pr-3 flex flex-col gap-3 ${selectedContact ? "max-md:hidden" : ""}`}
        >
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
        <div className="md:w-3/5 h-full p-3">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden flex flex-col">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
