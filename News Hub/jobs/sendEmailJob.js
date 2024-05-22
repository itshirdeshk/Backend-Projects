import { Queue, Worker } from "bullmq";
import { defaultJobOptions, redisConnection } from "../config/queue.js";
import logger from "../config/logger.js"
import { sendEmail } from "../config/mailer.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
    connection: redisConnection, defaultJobOptions: defaultJobOptions
});

// Worker
export const handler = new Worker(emailQueueName, async (job) => {
    console.log("The email worker data is", job.data);
    const data = job.data;
    data?.map(async (item) => {
        await sendEmail(item.toMail, item.subject, item.body);
    })
}, { connection: redisConnection })

// Worker listeners
handler.on("completed", (job) => {
    logger.info({ job: job, message: "Job Completed!" })
    console.log(`The job ${job.id} is completed.`);
})
handler.on("failed", (job) => {
    console.log(`The job ${job.id} is failed.`);
})