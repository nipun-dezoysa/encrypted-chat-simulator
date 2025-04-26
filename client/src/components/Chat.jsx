import React from "react";

function Chat() {
  const [selectedContact, setSelectedContact] = React.useState("ss");
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
        <div>Nipun</div>
        <div className="flex text-xs justify-between text-gray-400">
          <div>My Secret: 12</div>
          <div>My Compuvate: 12</div>
          <div>Others Compuvate: 12</div>
          <div>Key: 12</div>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center p-2 text-gray-400 font-semibold">
        Chat with
      </div>
    </>
  );
}

export default Chat;
