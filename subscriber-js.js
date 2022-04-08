import amqp from 'amqplib/callback_api.js';
import {generateChart, generateFile } from "./generateChart-ts-refac.ts";
import config from "config";

amqp.connect('amqp://localhost', (connectionError, connection) => {
    if(connectionError) {
        throw connectionError;
    }
    // Step 2: create channel
    connection.createChannel((channelError, channel) => {
        if(channelError) {
            throw channelError;
        }
        //Step 3: assert queue
        const queueName = config.get('QUEUE_NAME')
        channel.assertQueue(queueName, {
            durable: false
        });
        // Step 4: receive message
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);

        channel.consume(queueName, async (message) => {
            try {
                    console.log(" [x] Received data");
                    const data = JSON.parse(message.content)
                    // clustering
                    const charts = await generateChart(data)
                    console.log('chart generated')
                    const pages = await generateFile(data, charts)
                    console.log(pages + ' files written')
                } catch(ex) {
                    console.log(ex);
                } finally {
                    channel.ack(message);
                }
        }, {
                noAck: false
            });
    });
});



