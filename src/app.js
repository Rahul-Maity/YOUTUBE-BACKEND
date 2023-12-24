import express from "express";
const app = express();


import cookieParser from "cookie-parser";

import cors from "cors";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());


//routes import
import userRouter from './routes/user.routes.js';

//routes decleration
app.use("/api/v1/users", userRouter);

export { app };
