import { useState } from "react";
import { BsArrowRightCircleFill, BsFillMicFill } from "react-icons/bs"; // Import the microphone icon
import "./Chat2.scss";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() !== "") {
      // Add user message to messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userInput, isUser: true },
      ]);
      setUserInput(""); // Clear input field
      // Call function to process user input (e.g., send to backend for processing)
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chatbot</div>
      <div className="chatbot-content">
        {/* Display messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? "user" : "bot"}`}
          >
            <div
              className={`message-box ${
                message.isUser ? "user-box" : "bot-box"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="text-area">
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={handleUserInput}
          />
          <button type="submit">
            <BsArrowRightCircleFill size={18} />
          </button>
          <BsFillMicFill className="speech-icon" />
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
