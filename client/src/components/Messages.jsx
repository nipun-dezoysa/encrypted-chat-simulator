import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContextProvider";
import { encrypt, generateIV } from "../utils/ciphers";

function Messages() {
  const [message, setMessage] = useState("");
  const { socket, messages, addMessage, selectedContact } =
    useContext(ChatContext);
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const messageToSend = message;
    const iv = generateIV();
    const encryptedMessage = encrypt(messageToSend, selectedContact.key, iv);
    setMessage("");
    socket.emit("send_message", {
      to: selectedContact.name,
      message: encryptedMessage,
      iv: iv,
    });
    addMessage(selectedContact.name, messageToSend, encryptedMessage, true);
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

      <div className="w-full flex-1 flex flex-col gap-1 text-gray-400  overflow-y-auto p-1">
        {messages[selectedContact.name] &&
          messages[selectedContact.name].map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  msg.sent ? "ml-20" : "mr-20"
                } p-2 flex flex-col rounded-lg ${
                  msg.sent
                    ? "bg-blue-500 text-white flex-col-reverse"
                    : "bg-gray-200 text-black"
                }`}
              >
                <div>
                  <span className="text-xs">Encrypted:</span>{" "}
                  <span className="font-semibold text-sm break-all">
                    {msg.encrypt}
                  </span>
                </div>
                <div>
                  <span className="text-xs">Plain Text:</span>{" "}
                  <span className="font-semibold text-sm">{msg.message}</span>
                </div>
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
