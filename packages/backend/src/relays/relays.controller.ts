import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../auth/roles.decorator';
import { RelaysService } from './relays.service';

@ApiBasicAuth()
@ApiTags('relays')
@Controller('relays')
export class RelaysController {
  constructor(private readonly relaysService: RelaysService) {}

  @ApiOperation({
    description: `Close the relay number received in param during 10 sec, then reopen it. 
    \n The caller should have, at least, user right to perform this endpoint`,
  })
  @ApiResponse({
    status: 201,
    description: 'Request was received and relay is closed for 10 sec',
  })
  @Roles('user')
  @Post('openClose/:relayNumber')
  activateRelayForSeconds(@Param('relayNumber') relayNumber: number): boolean {
    return this.relaysService.activateRelayForSeconds(relayNumber, 10);
  }

  @ApiOperation({
    description: `find the current relay state of relay number received in param . 
    \n The caller should have, at least, user right to perform this endpoint`,
  })
  @ApiResponse({
    status: 200,
    description: 'The current relay state (true or false)',
  })
  @Roles('user')
  @Get('state/:relayNumber')
  getRelayState(@Param('relayNumber') relayNumber: number): boolean {
    return this.relaysService.getRelayState(relayNumber);
  }
}
