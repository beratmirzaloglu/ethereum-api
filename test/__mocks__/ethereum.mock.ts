import {
  GetSortedBalancesRequest,
  GetSortedBalancesResponse,
} from '@/ethereum/ethereum.dto';

export const mockInvalidAddresses = [
  '0xB012886385e2B629015bc11fdA61b790123C8454',
  '0xB012886385e2B629015bc11fdA61b798306C8423',
];

export const mockValidAddresses = [
  '0x4D496CcC28058B1D74B7a19541663E21154f9c84',
  '0xf5a58cc91f1de6F6f9aF19f5E87b967A9EEAFdEb',
];

export const mockEthPrice = 1621.32;

export const mockSortBalancesRequest: GetSortedBalancesRequest = {
  addresses: [...mockInvalidAddresses, ...mockValidAddresses],
};

export const mockSortBalancesResponse: GetSortedBalancesResponse = {
  wrong_addresses: mockInvalidAddresses,
  sorted_addresses: [
    {
      address: mockValidAddresses[0],
      eth_balance: 1,
      eth_usd_value: 2000,
      usdt_balance: 20,
      total_usd_value: 2020,
    },
    {
      address: mockValidAddresses[1],
      eth_balance: 2,
      eth_usd_value: 4000,
      usdt_balance: 200,
      total_usd_value: 4200,
    },
  ],
};

export const mockEthereumService = {
  getSortedBalances: jest.fn((_) => mockSortBalancesResponse),
};
