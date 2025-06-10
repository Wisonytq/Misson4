const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());


app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});