// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`app running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed! ", error);
  });

/*
import express from "express";
const app = express();
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", () => {
            console.log("ERROR ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR: ",error)
        throw err
    }
})()

*/
