import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from '../../controller/contacts.controller';
import { ContactsService } from '../../service/contacts.service';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  const mockService = {
    createContact: jest.fn(),
    getAllContacts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a contact', async () => {
    const dto = { 
      name: 'Test Contact', 
      email: 'test@test.com', 
      birthdate: '2000-01-01', 
      phone_personal: '123456', 
      company: 'Test Co', 
      city: 'Rosario', 
      province: 'Santa Fe' 
    };
    
    const userId = 'userId'; 
  
    mockService.createContact.mockResolvedValue(dto);
  
    const result = await controller.createContact(userId, dto); 
  
    expect(result).toEqual(dto);
    expect(mockService.createContact).toHaveBeenCalledWith('userId', dto);
  });
  
});
