import React, { useState } from 'react';
import './Chat.scss'; 
import {BsArrowRightCircleFill} from "react-icons/bs" 
import Card from '../card/Card';

function Chat() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState(''); 
  const [botResponse, setBotResponse] = useState('');
 
  async function query(data) {  
    const response = await fetch(
      "https://api-inference.huggingface.co/models/satvikag/chatbot",
      {
        headers: { Authorization: process.env.REACT_APP_TOKEN},
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }
 
  const submitUserInput = () => { 
    if (userInput.trim() === '') return;
 
    const updatedMessages = [...messages]; 
    const userMessage = `You said: "${userInput}"`;
    updatedMessages.push({ text: userMessage, isUser: true }); 
    if (userInput.trim() !== '') {
      query({ "inputs": userInput, "return_full_text": true }).then((response) => {
        const botResponse = response.generated_text; 
        updatedMessages.push({ text: botResponse, isUser: false }); 
        setMessages(updatedMessages);
      });
    }
  
    setUserInput('');

  };
  

  const addMessage = (text, isUser = false) => {
    const newMessage = { text, isUser };
    setMessages([...messages, newMessage]);
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };


  return (
    <div className="chatbot-container">
      <div className={`chatbot-box ${isMinimized ? 'minimized' : ''}`}>
        <div className={`chatbot-header ${!isMinimized ? 'minimized' : ''}`}>
          Chatbot 
        </div>
        <div className="chatbot-content">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
              <div className={`message-box ${message.isUser ? 'user-box' : 'bot-box'}`}>
                {message.text} 
              </div>
              <br/>
            </div>
          ))}
        </div>
      </div>
      {!isMinimized && (
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={handleUserInput}
            />
            <button onClick={submitUserInput}><BsArrowRightCircleFill size={18}/></button> 
          </div>
        )}
    </div>
  );
}

export default Chat;
