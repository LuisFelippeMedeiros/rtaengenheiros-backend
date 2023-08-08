import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseorderproductService } from './purchaseorderproduct.service';

describe('PurchaseorderproductService', () => {
  let service: PurchaseorderproductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseorderproductService],
    }).compile();

    service = module.get<PurchaseorderproductService>(PurchaseorderproductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
