import { AMQPClient } from '@cloudamqp/amqp-client'
import db from '../db'
import dotenv from 'dotenv'
import OLEvent from './OLEvent'
dotenv.config()

const lavinmqUrl: string = process.env.LAVIN_MQ_URL!
console.log("LavinMQ URL:", lavinmqUrl)

async function startConsumer() {
    //Setup a connection to the LavinMQ server
    const connection = new AMQPClient(lavinmqUrl)
    await connection.connect()
    const channel = await connection.channel()

    console.log("[✅] Connection over channel established")
    console.log("[❎] Waiting for messages. To exit press CTRL+C ")

    const q = await channel.queue('openlytics_events', { durable: false })

    await q.subscribe({ noAck: true }, async (msg) => {
        try {
            const apiKey = msg.properties.headers?.apiKey
            if (!apiKey) {
                console.error("API key missing in message headers")
                return
            }

            // Parse Event object
            const body = msg.bodyToString()
            if (!body) {
                console.error("Empty message body")
                return
            }

            const project = await db.projectConfiguration.findFirst({
                where: { apiKey: apiKey.toString() }
            })
            if (!project) {
                console.error("Invalid API key:", apiKey)
                return
            }
            console.log("Project found:", project.id)

            const event: OLEvent = JSON.parse(body)

            let existingUser = await db.userEvent.findFirst({
                where: { id: event.userId }
            })
            if (!existingUser) {
                existingUser = await db.userEvent.create({
                    data: { id: event.userId }
                })
            }

            await db.event.create({
                data: {
                    eventType: event.event,
                    UserEvent: { connect: { id: existingUser.id } },
                    Project: { connect: { id: project.projectId } },
                    customFields: event.properties,
                    createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
                }
            })
        } catch (error) {
            console.error(error)
        }
    })

    //When the process is terminated, close the connection
    process.on('SIGINT', () => {
        channel.close()
        connection.close()
        console.log("[❎] Connection closed")
        process.exit(0)
    });
}

startConsumer().catch(console.error);
