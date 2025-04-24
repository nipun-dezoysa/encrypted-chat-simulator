import Login from "./components/Login";
import { ChatContextProvider } from "./context/ChatContextProvider";
import "./index.css";
function App() {
  return (
    <ChatContextProvider>
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Login />
      </div>
    </ChatContextProvider>
  );
}

export default App;
