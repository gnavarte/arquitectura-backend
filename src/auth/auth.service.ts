import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.save({
        ...rest,
        password: hashedPassword,
      });
      delete user.password;
      const payload: JwtPayload = { id: user.id };
      const token = this.getJwtToken(payload);
      return { user, token };
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { id: user.id };
    const token = this.getJwtToken(payload);
    return { user, token };
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
  
  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    } else {
      throw new InternalServerErrorException();
    }
  }
}