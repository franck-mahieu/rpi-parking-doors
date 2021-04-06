import { ApiProperty } from '@nestjs/swagger';

export class SqliteDatabaseReturnDto {
  @ApiProperty({
    description: 'Number of changes for the request in database',
    example: 1,
  })
  changes: number;

  @ApiProperty({
    description: 'The rowid of the most recent successful INSERT',
    example: 0,
  })
  lastInsertRowid: number;
}
