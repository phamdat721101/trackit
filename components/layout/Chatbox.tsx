"use client";

import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, SendHorizonalIcon, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");

    const reply = await fetchBotMessage(inputMessage);

    if (reply) {
      const botMessage: Message = {
        id: Date.now(),
        text: reply,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  const fetchBotMessage = async (userInput: string) => {
    const url = "https://api.trackit-app.xyz/v1/agent/chat";
    const value = {
      content: userInput,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      const result: string = await response.json();
      const cleanResult = result.replace(/<think>|<\/think>/g, "");
      return cleanResult;
    } catch (error) {
      console.log("Failed to fetch response.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-gray-800">Chat</h3>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start mb-4 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <Avatar className="mr-2 text-gray-800">
                    <AvatarFallback>
                      <Bot size={24} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <Avatar className="ml-2 text-gray-800">
                    <AvatarFallback>
                      <User size={24} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              onClick={sendMessage}
              className="bg-bluesky hover:bg-blue-500 text-white p-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <SendHorizonalIcon size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-bluesky hover:bg-blue-300 text-white rounded-full p-3 shadow-lg transition-all duration-200 ease-in-out"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
