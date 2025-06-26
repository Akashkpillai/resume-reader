import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ResumeController } from './resume/resume.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANALYZER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Kafka broker
          },
          consumer: {
            groupId: 'api-gateway-consumer', // unique per service
          },
        },
      },
    ]),
  ],
  controllers: [AppController, ResumeController],
  providers: [AppService],
})
export class AppModule {}
