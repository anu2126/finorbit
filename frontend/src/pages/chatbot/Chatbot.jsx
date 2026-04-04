// App.jsx
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import './Chatbot.scss';
//import.meta.env
const apiURL = import.meta.env.VITE_API_URL;


function Chatbot() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    
    if (input.trim() === "") return;
    
    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear input and set loading state
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await axios({
        url: import.meta.env.VITE_CHATBOT_URL,
        method: "post",
        data: {
          "contents": [{
            "parts": [{ "text": input }]
          }]
        },
      });
      
      // Add bot response to chat
      const botMessage = { 
        text: response.data.candidates[0].content.parts[0].text,
        sender: 'bot'
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // Add error message to chat
      const errorMessage = { 
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'bot'
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id="root">
      <div className="chat-container">
        <div className="chat-header">
          Chat AI Assistant
        </div>
        
        <div className="chat-box" ref={chatBoxRef}>
          {messages.length === 0 ? (
            <div className="welcome-message bot-message">
              Hello! How can I help you today?
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={message.sender === 'user' ? 'user-message' : 'bot-message'}
              >
                {message.text}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="bot-message loading">
              Thinking...
            </div>
          )}
        </div>
        
        <form className="chat-footer" onSubmit={sendMessage}>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || input.trim() === ""}>
            Send
          </button>
          {isLoading && <div className="typing-indicator">AI is typing...</div>}
        </form>
      </div>
    </div>
  );
}

export default Chatbot;