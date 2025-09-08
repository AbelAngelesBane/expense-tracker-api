import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import getTransactionRoute from './routes/transaction/getTransactionRoute.js'
import { initDb } from "./config/db.js";
import {job} from "./config/cron.js"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

//middleware or my returns will be undefined
// .use for middleware
//.get for routes

app.use(rateLimiter)
app.use(express.json())


if(process.env.NODE_ENV === "production") job.start()


app.get("/api/health", (req, res) => {
    res.status(200).json({status: "0k"})
})

app.use("/api/transaction", getTransactionRoute);


initDb().then(() =>{
    app.listen(5001,()=>{
    console.log("SERVER IS RUNNING ON PORT:5001");
    })
})

