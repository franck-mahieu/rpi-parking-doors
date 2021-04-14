import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { BasicAuthGuard } from './auth/guards/basic-auth.guard';
import { ConfigModule } from './common/config/config.module';
import { SqliteModule } from './common/databases/sqlite/sqlite.module';
import { RelaysModule } from './relays/relays.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    RelaysModule,
    UsersModule,
    SqliteModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend/build/'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BasicAuthGuard,
    },
  ],
})
export class AppModule {}
