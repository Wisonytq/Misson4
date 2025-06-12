import { useRef, useEffect, useState } from "react";
import styles from "./Chatbox.module.css";
import axios from "axios";

export default function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the bottom when messages update
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  //Handles the form submission when the user sends a message
  const handleSubmit = async (e) => {
    e.preventDefault();// Prevents the page from reloading when the form is submitted

    // Creates a new message array that includes the user's message
    const newMessages = [...messages, { sender: "user", text: userInput }];
    // Update the messages state to show the user's message on the screen
    setMessages(newMessages);
    // Clear the input box
    setUserInput("");

    try {
      // Sends the updated message history to the backend and waits for AI's reply
      const aiReply = await getGeminiReply(newMessages);
      // Adds AI reply to the message list
      setMessages([...newMessages, { sender: "ai", text: aiReply }]);
    } catch (err) {
      // If there’s an error getting a reply from Tina, log it to the console
      console.error("Error getting AI reply:", err);
      // Show an error message in the chatbox
      setMessages([
        ...newMessages,
        { sender: "ai", text: "Sorry, I couldn't get a response." },
      ]);
    }
  };
  //Sends the chat history to the backend and gets a response from AI
  const getGeminiReply = async (messageHistory) => {
    // Sends a request to the backend API with the message history
    const res = await axios.post("http://localhost:5000/chat", {
      messages: messageHistory,
    });
    // Return just the reply text from the response
    return res.data.reply;
  };

  return (
    <div>
      <div className={styles.heading}>
        <h1>Tina - Your AI Insurance Policy Assistant</h1>
      </div>
      <div ref={chatRef} className={styles.chatbox}>
        {messages.map((msg, idx) => (
          <div className={styles[msg.sender]} key={idx}>
            <span className={styles.names}><strong>{msg.sender === "ai" ? "Tina:" : "Me:"}</strong></span>
            {msg.text}
          </div>
        ))}
      </div>
      <form className={styles.chatInput} onSubmit={handleSubmit}>
        <input
          className={styles.userInput}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className={styles.submitBtn} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
