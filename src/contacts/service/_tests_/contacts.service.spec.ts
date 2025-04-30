import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from '../../service/contacts.service';
import { ContactsRepository } from '../../repository/contacts.repository';
import { PrismaService } from '../../../prisma/prisma.service';

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

const mockPrismaService = {};

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: ContactsRepository,
          useValue: mockRepo,
        },
        {
          provide: PrismaService, 
          useValue: mockPrismaService,
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
    const dto = { name: 'Test Contact', email: 'test@test.com', birthdate: '2000-01-01', phone_personal: '123456', company: 'Test Co', city: 'Rosario', province: 'Santa Fe' };
    mockRepo.createContact.mockResolvedValue(dto);

    const result = await service.createContact('userId', dto);
    expect(result).toEqual(dto);
    expect(mockRepo.createContact).toHaveBeenCalledWith('userId', dto);
  });
});
