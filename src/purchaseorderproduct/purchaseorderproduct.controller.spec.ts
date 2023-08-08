import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseorderproductController } from './purchaseorderproduct.controller';
import { PurchaseorderproductService } from './purchaseorderproduct.service';

describe('PurchaseorderproductController', () => {
  let controller: PurchaseorderproductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseorderproductController],
      providers: [PurchaseorderproductService],
    }).compile();

    controller = module.get<PurchaseorderproductController>(PurchaseorderproductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
