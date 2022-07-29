import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProductDto: CreateUserDto) {
    try {
      const { password, ...userDate } = createProductDto;

      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password, 10),
      });

      return await this.userRepository.save(user);

      // TODO - retornar un jwt
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password'],
    });

    if (!user) throw new UnauthorizedException('Creditentials invalid');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Creditentials are not valid');

    return user;
    // TODO - retornar un jwt
  }

  private handleError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Something went wrong');
  }
}
