
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();

const router = express.Router();

router.post("/text", async (req, res) => {
  try{
    const {text, activeChatId} = req.body;
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0
    });

    console.log(response.data.choices[0].text);

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      {text: response.data.choices[0].text},
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET
        }
      }
    )

    res.status(200).json({text})
  }catch(error){
    console.error("error", error);
    res.status(500).json({error: error.message});
  }
});

router.post("/code", async (req, res) => {
  try{
    const {text, activeChatId} = req.body;
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." }, // this represents the bot and what role they will assume
        { role: "user", content: text }
      ],
    });

    console.log("response: ", response.data.choices[0].message.content);

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      {text: response.data.choices[0].message.content},
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET
        }
      }
    )

    res.status(200).json({text})
  }catch(error){
    console.error("error", error.response);
    res.status(500).json({error: error.message});
  }
});

router.post("/assist", async (req, res) => {
  try{
    const {text} = req.body;
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Finish my thought: ${text}`,
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0
    });

    console.log(response.data.choices[0].text);

    res.status(200).json({text: response.data.choices[0].text})
  }catch(error){
    console.error("error", error);
    res.status(500).json({error: error.message});
  }
});

export default router;
