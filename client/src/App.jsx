import { useContext, useEffect, useState } from "react";
import Login from "./components/Login";
import { ChatContext } from "./context/ChatContextProvider";
import "./index.css";
import ChatScreen from "./components/ChatScreen";
function App() {
  const { socket, user, setUser } = useContext(ChatContext);

  useEffect(() => {
    socket.on("logged", (data) => {
      setUser(data);
    });
  }, [socket]);
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {user ? <ChatScreen /> : <Login />}
    </div>
  );
}

export default App;
