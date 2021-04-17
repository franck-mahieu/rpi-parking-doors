import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { SqliteDatabaseReturnDto } from '../common/databases/sqlite/sqlite.dto';
import {
  AddUserDto,
  GetRolesAndGuidQueryDto,
  RemoveUserDto,
  UpdateUserPasswordDto,
} from './users.dto';
import { IRolesAndGuid, UsersService } from './users.service';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    description: `Return roles and guid of a specific user received in basic auth or in guid query param. 
    \n The caller should have, at least, user right to perform this endpoint`,
  })
  @ApiResponse({
    status: 200,
    description: 'password was update',
    type: SqliteDatabaseReturnDto,
  })
  @Roles('user')
  @Get('rolesAndGuid')
  async getRolesAndGuid(
    @Req() request,
    @Query('guid') guid: GetRolesAndGuidQueryDto,
  ): Promise<IRolesAndGuid> {
    return this.usersService.getRolesAndGuid(request, guid);
  }

  @ApiOperation({
    description: `Find all users in database. 
    \n The caller should have admin right to perform this endpoint`,
  })
  @ApiResponse({
    status: 200,
    description: 'password was update',
    type: SqliteDatabaseReturnDto,
  })
  @Roles('admin')
  @Get('all')
  async getAllUsers(): Promise<Array<string>> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({
    description: `Remove the user with the received login. 
    \n The caller should have admin right to perform this endpoint`,
  })
  @ApiResponse({
    status: 200,
    description: 'user was remove',
    type: SqliteDatabaseReturnDto,
  })
  @Roles('admin')
  @Delete('remove')
  async removeUser(@Body() body: RemoveUserDto): Promise<string> {
    return this.usersService.removeUser(body?.login);
  }

  @ApiOperation({
    description: `Update the password of received login, with received password. 
    \n The caller should have admin right to perform this endpoint`,
  })
  @ApiResponse({
    status: 201,
    description: 'password was update',
    type: SqliteDatabaseReturnDto,
  })
  @Roles('admin')
  @Post('updatepassword')
  async updateUserPassword(
    @Body() body: UpdateUserPasswordDto,
  ): Promise<string> {
    return this.usersService.updateUserPassword(body?.login, body?.password);
  }

  @ApiOperation({
    description: `Create a new user with body informations received.
    \n The caller should have admin right to perform this endpoint `,
  })
  @ApiResponse({
    status: 200,
    description: 'User was create',
    type: SqliteDatabaseReturnDto,
  })
  @Roles('admin')
  @Put('add')
  async addUser(@Body() body: AddUserDto): Promise<string> {
    return this.usersService.addUser({
      login: body?.login,
      password: body?.password,
      roles: body?.roles,
      email: body?.email,
      expiration: body?.expiration,
    });
  }
}
