import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from '../../service/contacts.service';
import { ContactsRepository } from '../../repository/contacts.repository';
import { NotificationService } from '../../../notifications/service/notifications.service';
import { S3Service } from '../../../common/services/s3.service'; 

describe('ContactsService', () => {
  let service: ContactsService;
  let repository: ContactsRepository;

  const mockRepo = {
    getContacts: jest.fn(),
    getFavoriteContacts: jest.fn(),
    createContact: jest.fn(),
    updateContact: jest.fn(),
    findById: jest.fn(),
    deleteContact: jest.fn(),
  };

  const mockNotificationService = {
    createNotification: jest.fn(),
    markAllAsRead: jest.fn(),
  };

  const mockS3Service = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: ContactsRepository,
          useValue: mockRepo,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    repository = module.get<ContactsRepository>(ContactsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a contact', async () => {
    const dto = {
      name: 'Test Contact',
      email: 'test@test.com',
      birthdate: '2000-01-01',
      phone_personal: '123456',
      company: 'Test Co',
      city: 'Rosario',
      province: 'Santa Fe',
    };

    mockRepo.createContact.mockResolvedValue(dto);

    const result = await service.createContact('userId', dto);
    expect(result).toEqual(dto);
    expect(mockRepo.createContact).toHaveBeenCalledWith('userId', dto);
  });
});
