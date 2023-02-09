import { Test, TestingModule } from '@nestjs/testing';
import { EthereumService } from '@/ethereum/ethereum.service';
import { HttpModule } from '@nestjs/axios';
import {
  mockInvalidAddresses,
  mockSortBalancesRequest,
  mockSortBalancesResponse,
  mockValidAddresses,
} from '@Mock/ethereum.mock';
import { Wallet } from '@/ethereum/ethereum.dto';

describe('EthereumService', () => {
  let service: EthereumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [EthereumService],
    }).compile();

    service = module.get<EthereumService>(EthereumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return current ethereum price in usd', async () => {
    const response = await service.getEthereumPrice();
    expect(response).toBeGreaterThanOrEqual(0);
  });

  it('should return the current usdt balance of the valid eth address', async () => {
    const mockWallet = mockSortBalancesResponse.sorted_addresses[0];
    const balance = await service.getUsdtBalance(mockWallet.address);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  it('should return the current eth balance of the valid eth address', async () => {
    const mockWallet = mockSortBalancesResponse.sorted_addresses[0];
    const balance = await service.getEthereumBalance(mockWallet.address);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  it('should return the balance details of the given address', async () => {
    const ethereumPrice = await service.getEthereumPrice();
    const mockWallet = mockSortBalancesResponse.sorted_addresses[0];
    const walletDetails = await service.getWalletDetails(
      mockWallet.address,
      ethereumPrice,
    );
    expect(walletDetails.eth_balance).toBeGreaterThanOrEqual(0);
    expect(walletDetails.usdt_balance).toBeGreaterThanOrEqual(0);
    expect(walletDetails.eth_usd_value).toBe(
      walletDetails.eth_balance * ethereumPrice,
    );
    expect(walletDetails.total_usd_value).toBe(
      walletDetails.eth_usd_value + walletDetails.usdt_balance,
    );
  });

  it('should filter valid and invalid eth addresses, get eth balances of valid addresses and calculate usd value of the eth balance and sort them by usd value of eth balance', async () => {
    const response = await service.getSortedBalances(mockSortBalancesRequest);
    expect(response.wrong_addresses).toEqual(mockInvalidAddresses);
    expect(response.sorted_addresses.length).toBe(mockValidAddresses.length);
    const clonedValidAddresses = [...response.sorted_addresses];
    clonedValidAddresses.sort((a, b) => b.eth_usd_value - a.eth_usd_value);
    expect(clonedValidAddresses).toEqual(response.sorted_addresses);

    response.sorted_addresses.forEach((address) => {
      expect(address).toBeInstanceOf(Wallet);
      expect(mockValidAddresses).toContain(address.address);
      expect(address.eth_balance).toBeGreaterThanOrEqual(0);
      address.eth_balance > 0
        ? expect(address.eth_usd_value).toBeGreaterThan(0)
        : expect(address.eth_usd_value).toBe(0);
    });
  });
});
