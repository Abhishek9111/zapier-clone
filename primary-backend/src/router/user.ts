import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SigninSchema, SignupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
const router = Router();

router.post("/signup", async (req, res) => {
  const username: string = req.body;
  const parsedData = SignupSchema.safeParse(username);

  // if (!parsedData.success) {
  //   return res.status(411).json({
  //     message: "Incorrect inputs",
  //   });
  // }

  const userExists = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data?.username,
    },
  });
  if (userExists) {
    return res.status(403).json({
      message: "User already exists",
    });
  }
  await prismaClient.user.create({
    data: {
      //@ts-ignore
      email: parsedData.data.username,
      //   IMPLEMENT HASHING HERE
      //@ts-ignore

      password: parsedData.data.password,
      //@ts-ignore

      name: parsedData.data.name,
    },
  });

  //SEND OUT A EMAIL FOR VERIFICATION
  return res.json({
    message:
      "Please verify your account by clicking on the link sent via email.",
  });
});

router.post("/signin", async (req, res) => {
  const username: string = req.body;
  const parsedData = SigninSchema.safeParse(username);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: "User doesn't exist",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_PASSWORD
  );

  res.json({
    token: token,
  });
});

router.get("/user", authMiddleware, async (req, res) => {
  //FIX THe TYPE
  //@ts-ignore
  const id = req.id;

  const user = await prismaClient.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return res.json({
    user,
  });
});

export const userRouter = router;
