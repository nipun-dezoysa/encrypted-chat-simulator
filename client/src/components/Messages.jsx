import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContextProvider";

function Messages() {
  const [message, setMessage] = useState("");
  const { socket, messages, addMessage } = useContext(ChatContext);
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return; // Prevent sending empty messages
  };
  return (
    <>
      <div className="w-full flex-1 flex items-center justify-center p-15 text-center text-gray-400 font-semibold">
        Chat is established. You can now send messages.
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
