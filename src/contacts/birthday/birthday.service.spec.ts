import { Test, TestingModule } from '@nestjs/testing';
import { BirthdayCheckService } from './birthday.service';
import { ContactsService } from '../service/contacts.service';
import { NotificationService } from '../../notifications/service/notifications.service';

describe('BirthdayService', () => {
  let service: BirthdayCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirthdayCheckService,
        { provide: ContactsService, useValue: {} },
        { provide: NotificationService, useValue: {} },
      ],
    }).compile();
  
    service = module.get<BirthdayCheckService>(BirthdayCheckService);
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
