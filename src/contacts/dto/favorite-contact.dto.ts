import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteContactDto {
  @ApiProperty({ description: 'Whether the contact is marked as favorite (true/false)' })
  @IsBoolean()
  is_favorite: boolean;
}
