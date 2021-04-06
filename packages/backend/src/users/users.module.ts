import { Module } from '@nestjs/common';

import { SqliteService } from '../common/databases/sqlite/sqlite.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SqliteService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
