import {
  SortBalancesRequest,
  SortBalancesResponse,
} from '@/ethereum/ethereum.dto';
import { IFilterAddressesResponse } from '@/ethereum/ethereum.interface';

export const mockInvalidAddresses = [
  '0xB012886385e2B629015bc11fdA61b790123C8454',
  '0xB012886385e2B629015bc11fdA61b798306C8423',
];

export const mockValidAddresses = [
  '0x4D496CcC28058B1D74B7a19541663E21154f9c84',
  '0xf5a58cc91f1de6F6f9aF19f5E87b967A9EEAFdEb',
];

export const mockEthPrice = 1621.32;

export const mockSortBalancesRequest: SortBalancesRequest = {
  addresses: [...mockInvalidAddresses, ...mockValidAddresses],
};

export const mockSortBalancesResponse: SortBalancesResponse = {
  wrong_addresses: mockInvalidAddresses,
  sorted_addresses: [
    { address: mockValidAddresses[0], eth_balance: 1, usd_balance: 2000 },
    { address: mockValidAddresses[1], eth_balance: 2, usd_balance: 4000 },
  ],
};

export const mockFilterAddressesRequest = mockSortBalancesRequest;
export const mockFilterAddressesResponse: IFilterAddressesResponse = {
  validAddresses: mockValidAddresses,
  invalidAddresses: mockInvalidAddresses,
};

export const mockEthereumService = {
  sortBalances: jest.fn((_) => mockSortBalancesResponse),
};
