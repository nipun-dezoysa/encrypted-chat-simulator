import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContextProvider";

function Messages() {
  const [message, setMessage] = useState("");
  const { socket, messages, addMessage, selectedContact } =
    useContext(ChatContext);
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const messageToSend = message;
    setMessage("");
    socket.emit("send_message", {
      to: selectedContact.name,
      message: messageToSend,
    });
    addMessage(selectedContact.name, messageToSend, true);
  };

  useEffect(() => {
    socket.on("sent_message", (data) => {
      if (data) {
        if (data.error) {
          alert("User not found");
        }
      }
    });

    return () => {
      socket.off("sent_message");
    };
  }, [socket, selectedContact]);
  return (
    <>
      {!messages[selectedContact.name] && (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-15 text-center text-gray-400 font-semibold">
          Chat is established. You can now send messages.
        </div>
      )}

      <div className="w-full flex-1 flex flex-col text-gray-400 font-semibold overflow-y-auto">
        {messages[selectedContact.name] &&
          messages[selectedContact.name].map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  msg.sent ? "text-right" : "text-left"
                } p-2 m-2 rounded-lg ${
                  msg.sent ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-1 p-2">
        <input
          type="text"
          required
          placeholder="Enter a message"
          className="input-style w-full"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button type="submit" className="button-style">
          Send
        </button>
      </form>
    </>
  );
}

export default Messages;
