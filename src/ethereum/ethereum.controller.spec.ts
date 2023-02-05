import { Test, TestingModule } from '@nestjs/testing';
import { EthereumController } from '@/ethereum/ethereum.controller';
import { EthereumService } from '@/ethereum/ethereum.service';
import {
  mockEthereumService,
  mockSortBalancesRequest,
  mockSortBalancesResponse,
} from '@Mock/ethereum.mock';

describe('EthereumController', () => {
  let controller: EthereumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthereumController],
      providers: [EthereumService],
    })
      .overrideProvider(EthereumService)
      .useValue(mockEthereumService)
      .compile();

    controller = module.get<EthereumController>(EthereumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the sortBalances service method response', async () => {
    const response = await controller.sortBalances(mockSortBalancesRequest);
    expect(mockEthereumService.sortBalances).toHaveBeenCalledWith(
      mockSortBalancesRequest,
    );
    expect(response).toEqual(mockSortBalancesResponse);
  });
});
