import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { SqliteService } from '../common/databases/sqlite/sqlite.service';
import { BasicAuthGuard } from './guards/basic-auth.guard';

@Module({
  imports: [SqliteService],
  providers: [BasicAuthGuard],
  exports: [BasicAuthGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
