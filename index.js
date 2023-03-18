require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// initialisation d'OpenAI
const configuration = new Configuration({
  apiKey: process.env.GPT_APIKEY,
});
const openai = new OpenAIApi(configuration);

//route chat !
app.post("/chat/", async (req, res) => {
  // console.log(req.body.question);
  if (req.body.question) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.question }],
      });
      // console.log(completion.data.choices[0].message);
      res
        .status(200)
        .json({ response: completion.data.choices[0].message.content });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json("pas de question reçue...");
  }
});

//route générale

app.get("*", (req, res) => {
  res.status(404).json("Route not found");
});

app.listen(process.env.PORT, () => {
  console.log("OpenAI server starded !");
});
