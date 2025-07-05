//* IMPORTS
import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import axios from "axios"
import ConnectDB from "./database/db.js"
import urlModel from "./model/urlModel.js"
import cors from "cors";

//* INITIALISATIONS
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const backendUrl = process.env.BACKENDURL;
ConnectDB();
app.use(cors({
  origin: ['https://clip-url-red.vercel.app','http://localhost:5000']
}));
app.use(bodyParser.json());


//* ROOT ROUTER
app.get("/", (req, res) => {
    res.send("Hello World!");
})


//* API SHORTEN URL ROUTER
app.post("/api/shorten", async (req, res) => {
    const { originalUrl, customAlias } = req.body;
    const shortCode = customAlias;
    const existing = await urlModel.findOne({ shortCode });
    if (existing) return res.status(409).json({ error: 'Alias already taken' });
    const newUrl = new urlModel({
        originalUrl,
        shortCode
    });
    await newUrl.save();
    res.json({ shortUrl: `${backendUrl}/${shortCode}` });
})


//* SHORT URL REDIRECTION
app.get("/:code",async (req,res)=>{
    const shortCode = req.params.code;
    const existing = await urlModel.findOne({ shortCode });
    if(!existing){
        res.status(404).json({error: 'Incorrect short url'})
        return;
    }
    const originalUrl = existing.originalUrl;
    res.redirect(originalUrl);
})


//* SERVER LISTENING
app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
})