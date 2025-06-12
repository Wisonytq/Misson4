import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import TinaAI  from './config/TinaAI.js'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const Tina = new TinaAI(process.env.GEMINI_API_KEY);

app.post("/chat", (req, res) => Tina.handle(req, res));

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
