require("dotenv").config();
import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

const prismaClient = new PrismaClient();
const TOPIC_NAME = "zap-events";
const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});
async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });

  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      if (!message?.value?.toString()) {
        return;
      }

      //@ts-ignore
      const parsedValue = JSON.parse(message.value);
      const zapRunId = parsedValue.zapRunId;
      const stage = parsedValue.stage;

      const zapRunDetails = await prismaClient.zapRun.findFirst({
        where: {
          id: zapRunId,
        },
        include: {
          zap: {
            include: {
              actions: {
                include: {
                  type: true,
                },
              },
            },
          },
        },
      });

      const currentAction = zapRunDetails?.zap.actions.find(
        (x) => x.sortingOrder == stage
      );

      if (!currentAction) {
        console.log("current action not found");
      }
      console.log("currentAction", currentAction);

      //@ts-ignore
      if (currentAction.type.id == "email") {
        try {
          const zapRunMetaData = zapRunDetails?.metadata;

          const body = parse(
            (currentAction?.metadata as JsonObject).body as string,
            zapRunMetaData
          );
          const to = parse(
            (currentAction?.metadata as JsonObject).email as string,
            zapRunDetails
          );
          console.log("sending out an email");
          await sendEmail(to, body);
        } catch (err) {}
      }
      //@ts-ignore
      if (currentAction.type.id == "send-sol") {
        try {
          const zapRunMetaData = zapRunDetails?.metadata;
          const amount = parse(
            (currentAction?.metadata as JsonObject).amount as string,
            zapRunMetaData
          );
          const address = parse(
            (currentAction?.metadata as JsonObject).address as string,
            zapRunDetails
          );
          console.log("sending out solana");
          await sendSol(address, amount);
        } catch (e) {}
      }

      //slowing down the email out process
      await new Promise((r) => setTimeout(r, 500));
      const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1;

      //checking if any action is pending then pushing it back to kafka queue
      if (lastStage != stage) {
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                stage: stage + 1,
                zapRunId,
              }),
            },
          ],
        });
      }
      console.log("processing done");

      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}

main();
