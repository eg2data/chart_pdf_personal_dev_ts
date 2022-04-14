import amqp from 'amqplib/callback_api.js';
import {saveMessage, generateChart, generateFile } from "./generateChart";
import config from "config";
import {Message} from "amqplib";

// Step 1: create connection
//amqp.connect('amqp://tess_report:KHg4sZxTtjy3Aq4K@127.0.0.1:5672/kmi', (connectionError, connection) => {
amqp.connect('amqp://localhost', (connectionError, connection) => {
    console.log("tryConnection-subscriber")
    if(connectionError) {
        console.log("connectionError-subscriber")
        throw connectionError;
    }
    // Step 2: create channel
    connection.createChannel((channelError, channel) => {
        if(channelError) {
            throw channelError;
        }
        //Step 3: assert queue
        const queueName = config.get<string>('QUEUE_NAME')
        channel.assertQueue(queueName, {
            durable: false
        });
        // Step 4: receive message
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);

        channel.consume(queueName, async (message: Message | null) => {
                    if(message == null) {
                        console.log("No messages to subscribe.")
                    } else {
                        try {
                            console.log(" [x] Received data");
                            const data = await saveMessage(message.content);
                            const charts = await generateChart(data);
                            await generateFile(data, charts);
                            // const pages = await generateFile(data, charts);
                            // console.log(pages + ' files written')
                        } catch(ex) {
                            console.log(ex);
                        } finally {
                            channel.ack(message);
                        }
                    }

        }, {
                noAck: false
            });
    });
});



