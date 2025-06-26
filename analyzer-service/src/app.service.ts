import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as pdfParse from 'pdf-parse';
import { callGenAI } from './service/openAi.service';

@Injectable()
export class AppService {
  @MessagePattern('analyze.resume')
  async analyze(@Payload() payload: { resumeUrl: string }) {
    console.log('HI I am at analyzer service');
    const pdfBuffer = await (await fetch(payload.resumeUrl)).arrayBuffer();
    const text = await pdfParse(Buffer.from(pdfBuffer));
    const summary = await callGenAI(text.text);
    console.log(summary);
    return { summary };
  }
}
