import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const website = process.env.WEBSITE;
const phoneNumber = process.env.PHONE_NUMBER;
const API_KEY = process.env.GEMINI_API_KEY;

// Makes sure the API key is getting read
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in .env");
  process.exit(1);
}

export default class TinaAI {
  constructor(apiKey) {
    // Sets up the Gemini AI with the given API key
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // Handles the chat logic 
  async chat(userMessages) {
    // Instructions and rules for responding
    const tinaInstructions = `
Your name is Tina. You work for Turners Car Insurance. 
You help users choose between 3 insurance plans: 
1. Mechanical Breakdown Insurance, 
2. Comprehensive Car Insurance, 
3. Third Party Car Insurance.

Keep a friendly and engaging tone.

Start by saying:
"Hello I’m Tina. I help you choose the right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?"

Only ask questions if the user agrees. Use their answers to recommend the best plan.

ask about 3 questions or more before giving a recommendation.

Only if a user asks for a quote, recommend them to the website ${website} or to call ${phoneNumber}

Our representatives can provide a personalized quote based on your information.

Business rules:
- Mechanical Breakdown Insurance is not available to trucks and racing cars.
- Comprehensive Car Insurance is only available to vehicles less than 10 years old.
- Always explain why you’re recommending the plan(s).
`;

    // Formats the messages for Gemini, instructions and conversation history
    const formatted = [
      { role: "user", parts: [{ text: tinaInstructions }] },
      ...userMessages.map((msg) => ({
        role: msg.sender === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
      })),
    ];

    // Sets up the model to use
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Starts a new chat session using the formatted history
    const chat = await model.startChat({ history: formatted });

    // Gets the user's latest message
    const lastMessage = userMessages[userMessages.length - 1].text;
    // Sends it to Gemini and get the reply
    const result = await chat.sendMessage(lastMessage);

    return result.response.text();
  }

  // Express handler
  async handle(req, res) {
    const { messages } = req.body;

    // If messages are missing or not an array, return an error
    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "Missing or invalid messages array" });
    }

    try {
      // Get Tina’s reply using the chat method
      const reply = await this.chat(messages);
      res.json({ reply });// Sends the reply back to the frontend
    } catch (error) {
      // If something goes wrong, log it and send a 500 error
      console.error("❌ TinaAI error:", error);
      res.status(500).json({ error: "Failed to get AI response from Tina." });
    }
  }
}
