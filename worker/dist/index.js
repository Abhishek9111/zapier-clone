"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { PrismaClient } from "@prisma/client";
const kafkajs_1 = require("kafkajs");
const client_1 = require("@prisma/client");
const parser_1 = require("./parser");
const prismaClient = new client_1.PrismaClient();
const TOPIC_NAME = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: "main-worker" });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c;
                console.log({
                    partition,
                    offset: message.offset,
                    value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                });
                if (!((_c = message === null || message === void 0 ? void 0 : message.value) === null || _c === void 0 ? void 0 : _c.toString())) {
                    return;
                }
                //@ts-ignore
                const parsedValue = JSON.parse(message.value);
                const zapRunId = parsedValue.zapRunId;
                const stage = parsedValue.stage;
                const zapRunDetails = yield prismaClient.zapRun.findFirst({
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
                const currentAction = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.find((x) => x.sortingOrder == stage);
                if (!currentAction) {
                    console.log("current action not found");
                }
                console.log("currentAction", currentAction);
                //@ts-ignore
                if (currentAction.type.id == "email") {
                    try {
                        const zapRunMetaData = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                        const body = (0, parser_1.parse)((currentAction === null || currentAction === void 0 ? void 0 : currentAction.metadata).body, zapRunMetaData);
                        const to = (0, parser_1.parse)((currentAction === null || currentAction === void 0 ? void 0 : currentAction.metadata).email, zapRunDetails);
                        console.log("sending out an email");
                    }
                    catch (err) { }
                }
                //@ts-ignore
                if (currentAction.type.id == "send-sol") {
                    try {
                        const zapRunMetaData = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                        console.log("sending out solana");
                    }
                    catch (e) { }
                }
                //slowing down the email out process
                yield new Promise((r) => setTimeout(r, 500));
                const lastStage = ((zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.length) || 1) - 1;
                //checking if any action is pending then pushing it back to kafka queue
                if (lastStage != stage) {
                    yield producer.send({
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
                yield consumer.commitOffsets([
                    {
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString(),
                    },
                ]);
            }),
        });
    });
}
main();
