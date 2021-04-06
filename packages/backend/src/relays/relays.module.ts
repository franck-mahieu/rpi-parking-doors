import { Module } from '@nestjs/common';
import { RelaysController } from './relays.controller';
import { RelaysService } from './relays.service';

@Module({
  imports: [],
  controllers: [RelaysController],
  providers: [RelaysService],
})
export class RelaysModule {}
