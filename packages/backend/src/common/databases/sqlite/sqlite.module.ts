import { Global, Module } from '@nestjs/common';
import { SqliteService } from './sqlite.service';

@Global()
@Module({
  exports: [SqliteService],
  providers: [SqliteService],
})
export class SqliteModule {}
