import { Module } from '@nestjs/common';

import { CustomerController } from './controllers/customer.controller';
import { UserController } from './controllers/user.controller';

import { CustomerService } from './services/customer.service';
import { UserService } from './services/user.service';

@Module({
  imports: [],
  controllers: [CustomerController, UserController],
  providers: [CustomerService, UserService],
})
export class UsersModule {}
