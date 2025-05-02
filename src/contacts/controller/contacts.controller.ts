import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Query,
    Body,
    Request,
    UploadedFile,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { ContactsService } from '../service/contacts.service';
  import { FilterContactsDto } from '../dto/filter-contacts.dto';
  import { CreateContactDto } from '../dto/create-contact.dto';
  import { UpdateContactDto } from '../dto/update-contact.dto';
  import { FavoriteContactDto } from '../dto/favorite-contact.dto';
  import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { User } from '../../common/decorators/user.decorator';
  import { AuthGuard } from '@nestjs/passport';
  import { PaginationDto } from '../../common/dto/pagination.dto';
  import { UploadAvatarDto } from '../dto/upload-avatar.dto';
  
  @ApiBearerAuth()
  @ApiTags('Contacts')
  @Controller('contacts')
  export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
  
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'List contacts with pagination and filters.' })
    async getAllContacts(
      @User('userId') userId: string,
      @Query() paginationParams: PaginationDto,
      @Query() filterDto: FilterContactsDto,
    ) {
      return this.contactsService.getAllContacts(userId, paginationParams, filterDto);
    }
  
    @Get('favorites')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'List favorite contacts with pagination.' })
    async getFavorites(
      @Query() paginationDto: PaginationDto,
      @User('userId') userId: string,
    ) {
      return this.contactsService.getFavorites(userId, paginationDto);
    }
  
    @Get('deleted')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'List soft-deleted contacts with pagination and filters.' })
    async getDeletedContacts(
      @User('userId') userId: string,
      @Query() paginationParams: PaginationDto,
      @Query() filterDto: FilterContactsDto,
    ) {
      return this.contactsService.getDeletedContacts(userId, paginationParams, filterDto);
    }
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'Create a new contact.' })
      async createContact(@User('userId') userId: string, @Body() createContactDto: CreateContactDto) {
        return this.contactsService.createContact(userId, createContactDto);
      }
  
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'Update a contact.' })
    async updateContact(
      @User('userId') userId: string,
      @Param('id') id: string,
      @Body() updateContactDto: UpdateContactDto,
    ) {
      return this.contactsService.updateContact(userId, id, updateContactDto);
    }
  
    @Patch(':id/favorite')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'Mark or unmark contact as favorite.' })
    async markFavorite(
      @User('userId') userId: string,
      @Param('id') id: string,
      @Body() favoriteContactDto: FavoriteContactDto,
    ) {
      return this.contactsService.markFavorite(userId, id, favoriteContactDto);
    }
  
    @Patch(':id/avatar')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: UploadAvatarDto})
    @ApiOkResponse({ description: 'Upload avatar for a contact' })
    async uploadAvatar(
      @User('userId') userId: string,
      @Param('id') contactId: string,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.contactsService.uploadAvatar(userId, contactId, file);
    }

  
    @Patch(':id/restore')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'Restore a deleted contact.' })
    async restoreContact(
      @User('userId') userId: string,
      @Param('id') id: string,
    ) {
      return this.contactsService.restoreContact(userId, id);
    }
  
    @Get(':id/logs')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'Get logs for a contact.' })
    async getContactLogs(
      @User('userId') userId: string,
      @Param('id') id: string,
    ) {
      return this.contactsService.getContactLogs(userId, id);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ description: 'Soft delete a contact.' })
    async deleteContact(
      @User('userId') userId: string,
      @Param('id') id: string,
    ) {
      return this.contactsService.deleteContact(userId, id);
    }
  }
  