// App.jsx
import { useEffect, useRef, useState } from 'react';
import './Chatbot.scss';

// ✅ Hardcoded Q&A dictionary
const QA_DATABASE = {
  // Greetings
  "hello": "Hello! Welcome to FinOrbit. How can I help you with your finances today?",
  "hi": "Hi there! I'm your FinOrbit assistant. Ask me anything about budgeting, savings, or investments!",
  "hey": "Hey! How can I assist you today?",

  // Finance topics
  "what is finorbit": "FinOrbit is a personal finance management app that helps you track expenses, plan budgets, and grow your savings.",
  "how do i create a budget": "To create a budget: 1) List your monthly income, 2) List all fixed expenses (rent, bills), 3) Allocate amounts for variable spending, 4) Set a savings goal. FinOrbit helps automate all of this!",
  "what is sip": "SIP (Systematic Investment Plan) lets you invest a fixed amount regularly in mutual funds. Even ₹500/month can grow significantly over time through the power of compounding.",
  "how to save money": "Great question! Start with the 50-30-20 rule: 50% for needs, 30% for wants, and 20% for savings. FinOrbit can help you track this automatically.",
  "what is mutual fund": "A mutual fund pools money from many investors to invest in stocks, bonds, or other assets. It's managed by professionals and is great for beginners.",
  "what is inflation": "Inflation is the rate at which prices rise over time. If inflation is 6%, something that costs ₹100 today will cost ₹106 next year. Investing helps beat inflation.",
  "how to invest": "Start investing by: 1) Setting a goal, 2) Building an emergency fund, 3) Starting with SIPs in mutual funds, 4) Diversifying your portfolio. FinOrbit can guide you through each step!",
  "what is emergency fund": "An emergency fund is 3-6 months of living expenses saved in a liquid account. It protects you from unexpected events like job loss or medical emergencies.",
  "what is compound interest": "Compound interest means earning interest on your interest. For example, ₹10,000 at 10% yearly becomes ₹11,000 after year 1, then ₹12,100 after year 2 — without adding more money!",
  "how to reduce debt": "To reduce debt: 1) List all debts, 2) Pay minimums on all, 3) Focus extra payments on the highest-interest debt first (avalanche method), 4) Avoid new debt. FinOrbit can help track your progress.",
};

// ✅ Smart fuzzy matching function
function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  // Check for exact or partial keyword match
  for (const [key, answer] of Object.entries(QA_DATABASE)) {
    if (input.includes(key)) {
      return answer;
    }
  }

  // Default fallback response
  return "I'm sorry, I don't have an answer for that yet. Try asking about budgeting, SIP, mutual funds, savings, or how to invest!";
}

function Chatbot() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // ✅ Simulate a short delay so it feels natural
    setTimeout(() => {
      const botReply = getBotResponse(input);
      const botMessage = { text: botReply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 600);
  }

  return (
    <div id="root">
      <div className="chat-container">
        <div className="chat-header">
          FinOrbit AI Assistant
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.length === 0 ? (
            <div className="welcome-message bot-message">
              Hello! Ask me about budgeting, SIP, investments, savings, or mutual funds!
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
            placeholder="Ask me about finance..."
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
