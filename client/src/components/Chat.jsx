import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContextProvider";

function Chat() {
  const { selectedContact, socket, setContacts } = useContext(ChatContext);
  const [secret, setSecret] = useState("");

  const handleRequest = (e) => {
    e.preventDefault();
    socket.emit("accept_request", {
      computes: secret,
      to: selectedContact.name,
    });
  };

  useEffect(() => {
    socket.on("sentconres", (data) => {
      if (data) {
        if (data.error) {
          alert("User not found");
        } else {
          setContacts((prevContacts) => {
            return prevContacts.map((contact) => {
              if (contact.name === selectedContact.name) {
                return {
                  ...contact,
                  secret: secret,
                  myComputes: secret,
                };
              }
              return contact;
            });
          });
          setSecret("");
        }
      }
    });

    socket.on("accept_request", (data) => {
      if (data) {
        const { computes, from } = data;
        setContacts((prevContacts) => {
          return prevContacts.map((contact) => {
            if (contact.name === from) {
              return {
                ...contact,
                computes: computes,
              };
            }
            return contact;
          });
        });
      }
    });

    return () => {
      socket.off("sentconres");
      socket.off("accept_request");
    };
  }, [socket]);

  if (!selectedContact) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 text-gray-400 font-semibold">
        Select a contact to chat with
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-3 bg-gray-200 flex flex-col">
        <div>{selectedContact.name}</div>
        <div className="flex text-xs justify-between text-gray-400">
          <div>
            My Secret: {selectedContact.secret ? selectedContact.secret : "N/A"}
          </div>
          <div>
            My Compuvate:{" "}
            {selectedContact.myComputes ? selectedContact.myComputes : "N/A"}
          </div>
          <div>
            Others Compuvate:
            {selectedContact.computes ? selectedContact.computes : "N/A"}
          </div>
          <div>Key: {selectedContact.key ? selectedContact.key : "N/A"}</div>
        </div>
      </div>
      {!selectedContact.computes && (
        <div className="w-full h-full flex items-center justify-center p-15 text-center text-gray-400 font-semibold">
          Wait for the other user to confirm the chat request.
        </div>
      )}
      {!selectedContact.secret && (
        <div className="w-full h-full flex items-center justify-center p-15">
          <form onSubmit={handleRequest} className="flex flex-col gap-1">
            <input
              type="text"
              required
              placeholder="Enter a secret key"
              className="input-style w-full"
              onChange={(e) => setSecret(e.target.value)}
              value={secret}
            />
            <button type="submit" className="button-style">
              Confirm
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chat;
