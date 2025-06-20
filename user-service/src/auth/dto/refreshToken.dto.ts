import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: '0b115335a99b' })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  refreshToken: string;
}
