import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthorizationGuard } from 'src/guard/authorization.guard';
import { Request } from 'express';

@Controller('user')
@ApiTags('User')
export class UserController {
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(['admin']) // ✅ Only users with "admin" role can access
  @Get()
  @ApiBearerAuth() // ✅ This endpoint requires a valid JWT token
  findAll(@Req() req: Request) {
    return {
      message: 'This action returns all users',
      data: req['user'], // ✅ User is injected by your AuthGuard
    };
  }
}
