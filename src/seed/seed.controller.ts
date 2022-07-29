import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators';
import { SeedService } from './seed.service';
import { ValiRoles } from '../auth/interfaces/valid-roles.interface';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValiRoles.USER)
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
