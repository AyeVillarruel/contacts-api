import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'New name for the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'New password for the user' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
