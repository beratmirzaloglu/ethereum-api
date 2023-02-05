import { IsArray, IsString } from 'class-validator';

export class SortBalancesRequest {
  @IsArray()
  @IsString({ each: true })
  addresses: string[];
}

export class SortBalancesResponse {
  wrong_addresses: string[];
  sorted_addresses: Wallet[];
}

export class Wallet {
  address: string;
  eth_balance: number;
  usd_balance: number;
}
