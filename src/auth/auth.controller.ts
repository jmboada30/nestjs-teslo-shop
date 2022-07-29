import { Controller, Post, Body, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser, RawHeaders, Auth } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValiRoles } from './interfaces/valid-roles.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-token')
  @Auth()
  checkAuthToken(@GetUser() user: User) {
    return this.authService.checkUser(user);
  }

  @Get('me')
  @Auth(ValiRoles.USER)
  private(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return { user, email, headers: rawHeaders };
  }
}
