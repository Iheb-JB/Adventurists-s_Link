import express from "express";
import dotenv from "dotenv";
import connectToMongoDb from "./DB/connectToMongoDb.js";
import auth from '../Backend/Routes/auth.js'


dotenv.config();
const PORT = process.env.PORT || 5000;

import { JWT_SECRET, ADMIN_SECRET_KEY } from "./config.js";
const app = express();

app.use(express.json());// to parse json incoming content from req.body

app.use("/api/auth", auth);

app.get("/", async (req, res)=>{
    
    res.send("Server is up and running aloo");
})


app.listen(PORT , ()=> {
    connectToMongoDb();
    console.log(`Sever is running on this port ${PORT}`)

});