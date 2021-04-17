import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'Login to update',
    example: 'login',
  })
  login: string;

  @ApiProperty({
    description: 'New password to set',
    example: 'password',
  })
  password: string;
}

export class RemoveUserDto {
  @ApiProperty({
    description: "Users's login to remove",
    example: 'login',
  })
  login: string;
}

export class GetRolesAndGuidQueryDto {
  @ApiPropertyOptional({
    description: 'guid of the user to get. This information is optional',
    example: '7d991349-a5cc-4704-a860-8e62bc298d45',
  })
  guid: string;
}

export class AddUserDto {
  @ApiProperty({
    description: 'Login to create, should be unique',
    example: 'login',
  })
  login: string;

  @ApiProperty({
    description: 'Password of the new login',
    example: 'password',
  })
  password: string;

  @ApiProperty({
    description: 'Roles to set for this new user',
    example: 'user',
  })
  roles: string;

  @ApiProperty({
    description:
      'Email to set for this new user, should be unique, this field is optional',
    example: 'email@email.com',
  })
  email: string;

  @ApiProperty({
    description:
      'Expiration of the user, can be empty to not expire, this field is optional',
    example: '2021-02-09T11:01:58.135Z',
  })
  expiration: string | undefined;
}
