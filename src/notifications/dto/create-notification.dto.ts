import { IsUUID, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  contactId: string;

  @IsString()
  message: string;

  @IsString()
  type: 'BIRTHDAY' | 'CREATE' | 'DELETE' | 'RESTORE' | 'AVATAR' | 'FAVORITE'; 
}
