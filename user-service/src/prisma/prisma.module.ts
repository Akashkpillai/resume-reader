// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // optional: makes PrismaService available globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- important!
})
export class PrismaModule {}
