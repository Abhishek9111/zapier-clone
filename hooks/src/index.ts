import express from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  console.log("heree???");
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;
  //storing a new trigger
  await client.$transaction(async (tx) => {
    const run = await client.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    });
    await client.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });

  //   kafkaPublisher.publish({
  //     zapId
  //   })
  //push it to kafka/redis queue
});

app.listen(3002, () => {
  console.log("server started");
});
