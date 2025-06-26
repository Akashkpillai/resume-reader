import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'nestjs-consumer-client',
  brokers: ['localhost:9092'],
});

export const kafkaAdmin = kafka.admin();
