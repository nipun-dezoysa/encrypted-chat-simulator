import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContextProvider";

function ContactList() {
  const { contacts, setSelectedContact } = useContext(ChatContext);
  return (
    <div className="w-full h-[350px] bg-gray-100 rounded-lg">
      {contacts.length < 1 && (
        <div className="w-full h-full flex items-center justify-center p-2 text-gray-400 font-semibold">
          there is no chat yet
        </div>
      )}
      {contacts.map((contacti, index) => (
        <div
          key={index}
          onClick={() => setSelectedContact(contacti)}
          className="w-full h-12 bg-gray-200 rounded-lg flex items-center justify-between px-2 cursor-pointer hover:bg-gray-300"
        >
          <div className="text-gray-600 font-semibold">{contacti.name}</div>
          {!contacti.secret && (
            <div className="text-gray-400 font-semibold">Requested to Chat</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ContactList;
