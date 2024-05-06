import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  async signup(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.userRepository.save({
        ...rest,
        password: hashedPassword,
      });
      const payload: JwtPayload = { id: user.id };
      const token = this.getJwtToken(payload);
      delete user.password;
      return { user, token };
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User already exists');
      } else {
        throw new BadRequestException('Invalid data provided');
      }
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'password'] });    
    const isValidCredentials = user && await bcrypt.compare(password, user.password);
    if (!isValidCredentials) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { id: user.id };
    const token = this.getJwtToken(payload);
    return { user, token };
  }
  
  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
