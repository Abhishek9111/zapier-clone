import express from "express";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
// app.post("/zap/signup", (req, res) => {});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
//please migrate to start server rightly
app.listen(3000);
