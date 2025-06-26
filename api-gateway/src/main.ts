import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { kafkaAdmin } from './kafka/kafka-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('The gateway API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'api-gateway-consumer',
      },
    },
  });
  await kafkaAdmin.connect();
  await kafkaAdmin.createTopics({
    topics: [
      {
        topic: 'resume.analyze',
        numPartitions: 1, // or more if needed
      },
    ],
  });

  await kafkaAdmin.disconnect();
  // await new Promise((res) => setTimeout(res, 5000));
  await app.startAllMicroservices();

  await app.listen(3000);
  console.log('API Gateway is running on http://localhost:3000');
  console.log('Kafka consumer is running with groupId: api-gateway-consumer');
  console.log('Kafka broker is connected at localhost:9092');
}
bootstrap();
