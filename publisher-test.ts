// import amqp from 'amqplib/callback_api.js';
const amqp = require('amqplib/callback_api.js')
const config = require('config')
const tessData = require('./replaced.json') as Array<any>

const centerCode =  [111, 112, 113, 211, 611, 612, 711];

const newTessData = tessData.map((value, index: number) => {
    // 이게 먹힌다. 즉, type Data에만 맞으면, 정상적으로 들어간다는 것.
    // return { ...value }

    return {
        "info" : {
            "name": `test ${index+101}`,
            "reservationNumber": `${index+1000000001}`,
            "centerCode": centerCode[Math.floor(Math.random() * centerCode.length)],
            "examDate": `${new Date(value.date).getFullYear()}-${("0" + (new Date(value.date).getMonth()+1)).slice(-2)}-${new Date(value.date).getDate()}`,
            "reportDate": `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${new Date().getDate()}`,
        },
        "KOSS": {
          "autonomy": {
              "distribution": value.KOSS.autonomy.distribution,
              "score": 15
          }
        },

        ...value

        // 이제 할 일은, row data를 최대한 정리하고.
        // 바꿀 것을 바꿔가면서 받아들이는 것. 그게 point.
    }
})

// Step 1: create connection
console.log("startingPoint-publisher")
//amqp.connect('amqp://tess_report:KHg4sZxTtjy3Aq4K@127.0.0.1:5672/kmi', (connectionError, connection) => {
amqp.connect('amqp://localhost', (connectionError: any, connection: any) => { // subscriber는 타입을 요구하지 않던데 음... 일단 any 처리
    console.log("tryConnection-publisher")
    if(connectionError) {
        console.log("connectionError-publisher")
        throw connectionError;
    }
    // Step 2: create channel
    connection.createChannel((channelError: any, channel: any) => { // subscriber는 타입을 요구하지 않던데 음... 일단 any 처리
        if(connectionError) {
            throw channelError;
        }
        // Step 3: assert queue
        const queueName = config.get('QUEUE_NAME')
        channel.assertQueue(queueName, {
            durable: false
        });
        // Step 4: send message to queue
        for (let i = 0; i < newTessData.length; i++) {
            const message = JSON.stringify(newTessData[i])
            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true
            });
            console.log(`[x] Sent data_${i} successfully.`)
            console.log(message)
        }
    })
    setTimeout(() => {
        connection.close();
        process.exit(0)
    }, 1000)
})