import { Test, TestingModule } from '@nestjs/testing';
import { EthereumService } from '@/ethereum/ethereum.service';
import { HttpModule } from '@nestjs/axios';
import {
  mockEthPrice,
  mockFilterAddressesResponse,
  mockInvalidAddresses,
  mockSortBalancesRequest,
  mockSortBalancesResponse,
  mockValidAddresses,
} from '@Mock/ethereum.mock';
import { Wallet } from '@/ethereum/ethereum.dto';
import { roundNumberTo2Decimals } from '@/utils/helpers';

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
    const response = await service.getCurrentEthPrice();
    expect(response).toBeGreaterThanOrEqual(0);
  });

  it('should return true if given eth address is valid, otherwise it should return false', () => {
    expect(service.isAddressValid(mockValidAddresses[0])).toEqual(true);
    expect(service.isAddressValid(mockInvalidAddresses[0])).toEqual(false);
  });

  it('should filter valid and invalid eth addresses', () => {
    expect(service.filterAddresses(mockSortBalancesRequest)).toEqual(
      mockFilterAddressesResponse,
    );
  });

  it('should return the current eth balance of the valid eth address', async () => {
    const mockWallet = mockSortBalancesResponse.sorted_addresses[0];
    const balance = await service.getBalance(mockWallet.address);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  it('should multiply the eth balance and eth price and round it to 2 decimals', () => {
    const mockWallet = mockSortBalancesResponse.sorted_addresses[0];
    expect(
      service.calculateUsdBalance(mockWallet.eth_balance, mockEthPrice),
    ).toBe(roundNumberTo2Decimals(mockWallet.eth_balance * mockEthPrice));
  });

  it('should filter valid and invalid eth addresses, get eth balances of valid addresses and calculate usd value of the eth balance and sort them by usd value of eth balance', async () => {
    const response = await service.sortBalances(mockSortBalancesRequest);
    expect(response.wrong_addresses).toEqual(mockInvalidAddresses);
    expect(response.sorted_addresses.length).toBe(mockValidAddresses.length);

    const clonedValidAddresses = [...response.sorted_addresses];
    clonedValidAddresses.sort((a, b) => b.usd_balance - a.usd_balance);
    expect(clonedValidAddresses).toEqual(response.sorted_addresses);

    response.sorted_addresses.forEach((address) => {
      expect(address).toBeInstanceOf(Wallet);
      expect(mockValidAddresses).toContain(address.address);
      expect(address.eth_balance).toBeGreaterThanOrEqual(0);
      address.eth_balance > 0
        ? expect(address.usd_balance).toBeGreaterThan(0)
        : expect(address.usd_balance).toBe(0);
    });
  });
});
