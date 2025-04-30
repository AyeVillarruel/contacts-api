import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactsRepository } from '../repository/contacts.repository';
import { FilterContactsDto } from '../dto/filter-contacts.dto';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { FavoriteContactDto } from '../dto/favorite-contact.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from 'src/notifications/service/notifications.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { S3Service } from 'src/common/services/s3.service';
import { Contact } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepo: ContactsRepository,
    private readonly prisma: PrismaService, 
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
      today.getDate() === birthDate.getDate();
  
    if (isBirthday) {
      await this.notificationService.createBirthdayNotification(
        userId,
        contact.id,
        `🎉 Hoy es el cumpleaños de ${contact.name}!`
      );
    }
   
   await this.contactsRepo.createLog(contact.id, userId, 'CREATE');
    return contact;
    
  }
  

  async updateContact(userId: string, contactId: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    const updatedContact = await this.contactsRepo.updateContact(contactId, updateContactDto);
    await this.contactsRepo.createLog(contactId, userId, 'UPDATE');
    return  updatedContact
    

  }

  async markFavorite(userId: string, contactId: string, favoriteContactDto: FavoriteContactDto) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

   const updated= await this.contactsRepo.updateContact(contactId, { is_favorite: favoriteContactDto.is_favorite });
    await this.contactsRepo.createLog(
      contactId,
      userId,
      favoriteContactDto.is_favorite ? 'MARK_FAVORITE' : 'UNMARK_FAVORITE',
    );
    return updated;
  }

  async uploadAvatar(userId: string, contactId: string, file: Express.Multer.File) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact) throw new NotFoundException('Contact not found');
  
    const imageUrl = await this.s3Service.uploadFile(file);
  
    const updated = await this.contactsRepo.updateContact(contactId, {
      profile_image: imageUrl,
    });
    await this.contactsRepo.createLog(contactId, userId, 'AVATAR');

    return updated;
  }
  
  

  async restoreContact(userId: string, contactId: string) {
    const contact = await this.contactsRepo.findDeletedById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Deleted contact not found');
    }

    const restored = await this.contactsRepo.restoreContact(contactId);
    await this.contactsRepo.createLog(contactId, userId, 'RESTORE');
    

    return restored;
  }

  async getContactLogs(userId: string, contactId: string) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.contactsRepo.getLogs(contactId);
  }
  async findContactsByBirthday(): Promise<Contact[]> {
    const allContacts = await this.prisma.contact.findMany({
      where: {
        deletedAt: null, 
      },
    });
  
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1; 
  
    return allContacts.filter((contact) => {
      const birthdate = new Date(contact.birthdate);
      return (
        birthdate.getDate() === todayDay &&
        birthdate.getMonth() + 1 === todayMonth 
      );
    });
  }
   

  async deleteContact(userId: string, contactId: string) {
    const contact = await this.contactsRepo.findOneById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

   const contactDelete = await this.contactsRepo.softDeleteContact(contactId);
    await this.contactsRepo.createLog(contactId, userId, 'DELETE');


    return  contactDelete;
  }
}
