// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  findAll(@Req() req: Request) {
    return {
      message: 'This action returns all users',
      data: req['user'], // Assuming Body contains user data
    }; // Placeholder response
    // return this.userService.findAll(Body);
  }
}
