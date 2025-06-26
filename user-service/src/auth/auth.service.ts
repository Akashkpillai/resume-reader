import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(signUpDto: SignUpDto): Promise<{ name: string; email: string }> {
    const { email, password, name } = signUpDto;

    const existingUser = await this.prisma.singup.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.singup.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return {
      name: newUser.name,
      email: newUser.email,
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const existingUser = await this.prisma.singup.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Here you would typically generate a JWT token

    return this.generateUserToken(existingUser.id, existingUser.role);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: {
        token: refreshTokenDto.refreshToken,
        expiry: {
          gte: new Date(),
        },
      },
    });

    if (!existingToken) {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }

    const user = await this.prisma.singup.findUnique({
      where: { id: existingToken.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // If the token is valid, delete it and generate a new one
    // This is to prevent reuse of the same refresh token
    await this.prisma.refreshToken.delete({
      where: {
        id: existingToken.id,
      },
    });
    return this.generateUserToken(existingToken.userId, user.role);
  }

  ///////////////////////////HELPER FUNCTIONS/////////////////////////

  async generateUserToken(
    userId: number,
    role?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const access = this.jwtService.sign(
      { id: userId, role },
      { expiresIn: '1h' },
    );
    const refreshToken = uuidv4(); // Generate a random refresh token
    await this.storeRefreshToken(refreshToken, userId); // Store the refresh token in the database
    return {
      accessToken: access,
      refreshToken: refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: number): Promise<void> {
    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 3); // Set expiry to
      await this.prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiry,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to store refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
