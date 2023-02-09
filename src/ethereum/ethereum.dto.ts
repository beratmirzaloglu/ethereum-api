import { IsArray, IsString } from 'class-validator';

export class GetSortedBalancesRequest {
  @IsArray()
  @IsString({ each: true })
  addresses: string[];
}

export class GetSortedBalancesResponse {
  wrong_addresses: string[];
  sorted_addresses: Wallet[];
}

export class Wallet {
  address: string;
  eth_balance: number;
  eth_usd_value: number;
  usdt_balance: number;
  total_usd_value: number;
}
