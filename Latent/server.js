import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Route to handle question generation
app.post('/ask-question', async (req, res) => {
  const { intro } = req.body;

  try {
    const response = await fetch("https://flow-api.mira.network/v1/flows/flows/tejasnangru/q-gen?version=1.0.0", {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'miraauthorization': 'sb-19ad91196c677d12ac195d76687c9e5c', // Replace with your API key
      },
      body: JSON.stringify({
        input: { intro },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Route to handle roast generation
app.post('/get-roast', async (req, res) => {
  const { ans } = req.body;

  try {
    const response = await fetch("https://flow-api.mira.network/v1/flows/flows/tejasnangru/roast1-generator?version=1.0.0", {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'miraauthorization': 'sb-19ad91196c677d12ac195d76687c9e5c', // Replace with your API key
      },
      body: JSON.stringify({
        input: { ans },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching roast:", error);
    res.status(500).json({ error: 'Failed to fetch roast' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
