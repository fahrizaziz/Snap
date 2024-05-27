import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionDbLinkService } from './connection-db-link.service';

describe('ConnectionDbLinkService', () => {
  let service: ConnectionDbLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionDbLinkService],
    }).compile();

    service = module.get<ConnectionDbLinkService>(ConnectionDbLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
