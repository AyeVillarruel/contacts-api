import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterContactsDto {
  @ApiPropertyOptional({ description: 'Search term to filter contacts by name, email, or company' })
  @IsOptional()
  @IsString()
  search?: string;
}
