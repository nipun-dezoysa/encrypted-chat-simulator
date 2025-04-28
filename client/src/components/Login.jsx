import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContextProvider";

function Login() {
  const { socket } = useContext(ChatContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    if (!name) return;
    // Emit the event to the server
    socket.emit("login", name);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[400px] w-full bg-white p-5 rounded-lg shadow-md flex flex-col gap-3"
    >
      <h1 className="text-center font-semibold">Encrypt Chat Simulator</h1>
      <input
        type="text"
        required
        placeholder="Enter your name"
        className="input-style w-full"
      />
      <button type="submit" className="button-style">
        Start Chatting
      </button>
    </form>
  );
}

export default Login;
