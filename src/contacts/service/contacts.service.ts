// contacts.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ContactsRepository } from '../repository/contacts.repository';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { FavoriteContactDto } from '../dto/favorite-contact.dto';
import { FilterContactsDto } from '../dto/filter-contacts.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { NotificationService } from '../../notifications/service/notifications.service';
import { S3Service } from '../../common/services/s3.service';
import { ContactLogAction } from '../enums/contact-log-actions';
import { NotificationType } from '../../notifications/enum/notification-type.enum';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepo: ContactsRepository,
    private readonly notificationService: NotificationService,
    private readonly s3Service: S3Service,
  ) {}

  async getAllContacts(userId: string, paginationParams: PaginationDto, filterDto: FilterContactsDto) {
    const { limit, offset } = paginationParams;

    const data = await this.contactsRepo.findContacts(userId, limit, offset, filterDto);
    const total = await this.contactsRepo.countContacts(userId, filterDto);

    return {
      data,
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  async getFavorites(userId: string, paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;

    const [data, total] = await Promise.all([
      this.contactsRepo.findFavoriteContacts(userId, limit, offset),
      this.contactsRepo.countFavoriteContacts(userId),
    ]);

    return {
      data,
      total,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  async getDeletedContacts(userId: string, paginationParams: PaginationDto, filterDto: FilterContactsDto) {
    const { limit, offset } = paginationParams;

    const data = await this.contactsRepo.findDeletedContacts(userId, limit, offset, filterDto);
    const total = await this.contactsRepo.countDeletedContacts(userId, filterDto);

    return {
      data,
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  async createContact(userId: string, dto: CreateContactDto) {
    const contact = await this.contactsRepo.createContact(userId, dto);

    const today = new Date();
    const birthDate = new Date(dto.birthdate);
    const isBirthday =
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() + 1=== birthDate.getDate();
    
    if (isBirthday) {
      await this.notificationService.createNotification(
        userId,
        contact.id,
        NotificationType.BIRTHDAY,
        `Hoy es el cumpleaños de ${contact.name}!`
      );
    }

    await this.notificationService.createNotification(
      userId,
      contact.id,
      NotificationType.CREATE,
      'Contacto creado exitosamente',
    );
    

    return contact;
  }

  async updateContact(userId: string, contactId: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact || contact.deletedAt) {
      throw new NotFoundException('Contact not found or has been deleted');
    }

    const updated = await this.contactsRepo.updateContact(contactId, updateContactDto);

    await this.contactsRepo.createLog(contactId, userId, ContactLogAction.UPDATE, {
      field: Object.keys(updateContactDto)[0],
      oldValue: contact[Object.keys(updateContactDto)[0]],
      newValue: updated[Object.keys(updateContactDto)[0]],
    });

    await this.notificationService.createNotification(
      userId,
      contactId,
      NotificationType.UPDATE,
      'Contacto actualizado exitosamente',
    );

    return updated;
  }

  async markFavorite(userId: string, contactId: string, favoriteContactDto: FavoriteContactDto) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact || contact.deletedAt) {
      throw new NotFoundException('Contact not found or has been deleted');
    }

    const updated = await this.contactsRepo.updateContact(contactId, {
      is_favorite: favoriteContactDto.is_favorite,
    });

    const logAction = favoriteContactDto.is_favorite ? ContactLogAction.MARK_FAVORITE : ContactLogAction.UNMARK_FAVORITE;
    await this.contactsRepo.createLog(contactId, userId, logAction, {
      field: 'is_favorite',
      oldValue: contact.is_favorite,
      newValue: updated.is_favorite,
    });
    await this.notificationService.createNotification(
      userId,
      contact.id,
       NotificationType.FAVORITE,
      `Marcaste a ${contact.name} como favorito`,
    );
    

    return updated;
  }

  async uploadAvatar(userId: string, contactId: string, file: Express.Multer.File) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    
    if (!contact || contact.deletedAt) {
      throw new NotFoundException('Contact not found or has been deleted');
    }
  
    const imageUrl = await this.s3Service.uploadFile(file);
  
    const updated = await this.contactsRepo.updateContact(contactId, { profile_image: imageUrl });
  
    await this.contactsRepo.createLog(contactId, userId, ContactLogAction.AVATAR, {
      field: 'profile_image',
      oldValue: contact.profile_image,
      newValue: updated.profile_image,
    });
  
    return updated;
  }
  

  async restoreContact(userId: string, contactId: string) {
    const contact = await this.contactsRepo.findDeletedById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Deleted contact not found');
    }

    const restored = await this.contactsRepo.restoreContact(contactId);
    await this.contactsRepo.createLog(contactId, userId, ContactLogAction.RESTORE, {
      field: 'deletedAt',
      oldValue: contact.deletedAt,
      newValue: restored.deletedAt,
    });
    return restored;
  }

  async getContactLogs(userId: string, contactId: string) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.contactsRepo.getLogs(contactId);
  }

  async findContactsByBirthday(day: number, month: number) {
    const start = new Date(`${new Date().getFullYear()}-${month}-${day}T00:00:00.000Z`);
    const end = new Date(`${new Date().getFullYear()}-${month}-${day}T23:59:59.999Z`);

    return this.contactsRepo.findByBirthdateRange(start, end);
  }

  async deleteContact(userId: string, contactId: string) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const deleted = await this.contactsRepo.softDeleteContact(contactId);
    await this.contactsRepo.createLog(contactId, userId, ContactLogAction.DELETE, {
      field: 'deletedAt',
      oldValue: contact.deletedAt,
      newValue: deleted.deletedAt,
    });
    return deleted;
  }
}
