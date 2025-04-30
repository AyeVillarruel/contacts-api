import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsDateString, IsBoolean, Matches } from 'class-validator';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'juan@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiPropertyOptional({ example: '1122334455' })
  @IsOptional()
  @IsString()
  phone_personal?: string;

  @ApiPropertyOptional({ example: '1199887766' })
  @IsOptional()
  @IsString()
  phone_work?: string;

  @ApiPropertyOptional({ example: 'Empresa X' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'Buenos Aires' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'CABA' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_favorite?: boolean;

  @ApiPropertyOptional({
    description: 'Profile image URL or uploads path. Must start with /uploads/ or be a valid URL (http or https).',
    example: '/uploads/6b9a38fc-087f-4fa2-9417-4c5673e7d5d7.jpg',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(\/uploads\/.+|https?:\/\/.+)/, {
    message: 'profile_image must be a valid uploads path or a valid URL',
  })
  profile_image?: string;
}

