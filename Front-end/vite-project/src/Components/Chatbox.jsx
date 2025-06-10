import { useState } from "react"
import styles from "./Chatbox.module.css"
import axios from "axios"

export default function Chatbox() {
    const [messages, setMessages]= useState([])
    const [userInput, setUserInput]=useState("")
    const [sessionId] = useState(() => Date.now().toString());

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setUserInput('');

        //Send to Gemini AI and get reply
        const aiReply = await getGeminiReply(newMessages); // Placeholder function
        setMessages([...newMessages, { sender: 'ai', text: aiReply }]);
    }

  return (
    <div>
        <div className={styles.heading}>
            <h1>Tina - Your AI Insurance Policy Assistant</h1>
        </div>
        <div className={styles.chatbox}>
            {messages.map((msg, idx) => (
                <div className={styles[msg.sender]} key={idx}>
                    <strong>{msg.sender === "ai" ? "Tina:" : "Me:"}</strong>{msg.text}
                </div>
            ))}
        </div>
        <form className={styles.chatInput} onSubmit={handleSubmit}>
            <input className={styles.userInput} value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type your message..." />
            <button className={styles.submitBtn} type="submit">Submit</button>
        </form>
    </div>
  )
}
