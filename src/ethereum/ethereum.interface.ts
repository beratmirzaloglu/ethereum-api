export interface IFilterAddressesResponse {
  validAddresses: string[];
  invalidAddresses: string[];
}

export interface IGetEthereumPriceResponse {
  ethereum: Currency;
}

interface Currency {
  usd: number;
}

export interface IGetBalancesResponse {
  ethereumBalance: number;
  usdtBalance: number;
}
