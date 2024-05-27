import { Test, TestingModule } from '@nestjs/testing';
import { LoginquirybilltransactionrepositoryService } from './loginquirybilltransactionrepository.service';

describe('LoginquirybilltransactionrepositoryService', () => {
  let service: LoginquirybilltransactionrepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginquirybilltransactionrepositoryService],
    }).compile();

    service = module.get<LoginquirybilltransactionrepositoryService>(
      LoginquirybilltransactionrepositoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
