// resume.controller.ts
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(
    @Inject('ANALYZER_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('analyze.resume');
    await this.client.connect();
  }

  @ApiBody({ type: Object, description: 'Resume data to analyze' })
  @ApiResponse({ status: 201, description: 'User successfully signed up.' })
  @Post('analyze')
  async analyze(@Body() body: { resumeUrl: string }) {
    console.log(
      'HI I am at resume controller-------------------------------------------->',
    );
    return this.client.send('analyze.resume', body);
  }
}
