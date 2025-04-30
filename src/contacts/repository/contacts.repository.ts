import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { FilterContactsDto } from '../dto/filter-contacts.dto';

@Injectable()
export class ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildFilter(filterDto: FilterContactsDto) {
    const { search } = filterDto;

    if (!search) return {};

    return {
      OR: [
        { name: { contains: search} },
        { email: { contains: search } },
        { company: { contains: search } },
        { city: { contains: search} },
      ],
    };
  }

  async createContact(userId: string, createContactDto: CreateContactDto) {
    if (!userId) {
      throw new Error('userId is required to create a contact');
    }
  
    const birthdate = new Date(createContactDto.birthdate);
    if (isNaN(birthdate.getTime())) {
      throw new Error('Invalid birthdate format');
    }
  
    return this.prisma.contact.create({
      data: {
        ...createContactDto,
        birthdate,
        user: { connect: { id: userId } },
      },
    });
  }
  

  async findOneById(contactId: string, userId: string) {
    return this.prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
        deletedAt: null,
      },
    });
  }

  async findDeletedById(contactId: string, userId: string) {
    return this.prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
        deletedAt: { not: null },
      },
    });
  }

  async updateContact(contactId: string, updateContactDto: Partial<UpdateContactDto>) {
   return await this.prisma.contact.update({
      where: { id: contactId },
      data: {
        ...updateContactDto,
        birthdate: updateContactDto.birthdate
          ? new Date(updateContactDto.birthdate)
          : undefined,
      },
    });
    
  }

  async softDeleteContact(contactId: string) {
    return this.prisma.contact.update({
      where: { id: contactId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restoreContact(contactId: string) {
    return this.prisma.contact.update({
      where: { id: contactId },
      data: {
        deletedAt: null,
      },
    });
  }

  async createLog(contactId: string, userId: string, action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'AVATAR'| 'MARK_FAVORITE' | 'UNMARK_FAVORITE' | 'BIRTHDAY' | 'RESTORE') {
    return this.prisma.contactLog.create({
      data: {
        contactId,
        userId,
        action,
        timestamp: new Date(),
      },
    });
  }  

  async getLogs(contactId: string) {
    return this.prisma.contactLog.findMany({
      where: { contactId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async findContacts(
    userId: string,
    limit: number | string,
    offset: number | string,
    filterDto: FilterContactsDto,
  ) {
    return this.prisma.contact.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      take: Number(limit) || 10,   
      skip: Number(offset) || 0,  
      orderBy: { name: 'asc' },
    });
  }
  

  async countContacts(userId: string, filterDto: FilterContactsDto) {
    return this.prisma.contact.count({
      where: {
        userId,
        deletedAt: null,
        ...this.buildFilter(filterDto),
      },
    });
  }

  async findFavoriteContacts(
    userId: string,
    limit: number | string,
    offset: number | string,
  ) {
    return this.prisma.contact.findMany({
      where: {
        userId,
        is_favorite: true,
        deletedAt: null,
      },
      take: Number(limit),
      skip: Number(offset),
      orderBy: { name: 'asc' },
    });
  }

  async countFavoriteContacts(userId: string) {
    return this.prisma.contact.count({
      where: {
        userId,
        is_favorite: true,
        deletedAt: null,
      },
    });
  }
  async findDeletedContacts(userId: string, limit: number, offset: number, filterDto: FilterContactsDto) {
    return this.prisma.contact.findMany({
      where: {
        userId,
        deletedAt: { not: null },
        ...this.buildFilter(filterDto),
      },
      skip: Number(offset),
      take: Number(limit),
      orderBy: { name: 'asc' },
    });
  }

  async countDeletedContacts(userId: string, filterDto: FilterContactsDto) {
    return this.prisma.contact.count({
      where: {
        userId,
        deletedAt: { not: null },
        ...this.buildFilter(filterDto),
      },
    });
  }
}
