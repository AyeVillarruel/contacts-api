import { IsString, IsOptional, IsEmail, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiPropertyOptional({ description: 'Full name of the contact' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the contact' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Birthdate of the contact in YYYY-MM-DD format' })
  @IsDateString()
  birthdate: string;

  @ApiPropertyOptional({ description: 'Personal phone number' })
  @IsString()
  phone_personal: string;

  @ApiPropertyOptional({ description: 'Work phone number', required: false })
  @IsOptional()
  @IsString()
  phone_work?: string;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsString()
  company: string;

  @ApiProperty({ description: 'Profile image URL or path', required: false })
  @IsOptional()
  @IsString()
  profile_image?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ description: 'Province or state' })
  @IsString()
  province: string;

  @ApiPropertyOptional({default: false, description: 'Is favorite'})
@IsOptional()
 @IsBoolean()
 is_favorite?: boolean; 
}
