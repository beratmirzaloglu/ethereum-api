import { roundNumberTo2Decimals } from '@Helper/helpers';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import Web3 from 'web3';
import {
  SortBalancesRequest,
  SortBalancesResponse,
  Wallet,
} from '@/ethereum/ethereum.dto';
import {
  IFilterAddressesResponse,
  IGetEthereumPriceResponse,
} from '@/ethereum/ethereum.interface';

@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);
  private web3: Web3;

  constructor(private readonly httpService: HttpService) {
    this.web3 = new Web3(process.env.ETH_NODE_URL);
  }

  async sortBalances(dto: SortBalancesRequest): Promise<SortBalancesResponse> {
    const response: SortBalancesResponse = {
      wrong_addresses: [],
      sorted_addresses: [],
    };

    const filteredAddresses = this.filterAddresses(dto);
    response.wrong_addresses = filteredAddresses.invalidAddresses;

    if (filteredAddresses.validAddresses.length == 0) return response;
    const ethPrice = await this.getCurrentEthPrice();

    for (const address of filteredAddresses.validAddresses) {
      const ethBalance = await this.getBalance(address);
      const wallet = new Wallet();
      wallet.address = address;
      wallet.eth_balance = ethBalance;
      wallet.usd_balance = this.calculateUsdBalance(
        wallet.eth_balance,
        ethPrice,
      );
      response.sorted_addresses.push(wallet);
    }
    response.sorted_addresses.sort((a, b) => b.usd_balance - a.usd_balance);

    return response;
  }

  calculateUsdBalance(ethBalance: number, ethPrice: number): number {
    return roundNumberTo2Decimals(ethBalance * ethPrice);
  }

  async getBalance(address: string): Promise<any> {
    const wei = await this.web3.eth.getBalance(address);
    const balance = this.web3.utils.fromWei(wei, 'ether');
    return parseInt(balance);
  }

  filterAddresses(dto: SortBalancesRequest): IFilterAddressesResponse {
    const response: IFilterAddressesResponse = {
      invalidAddresses: [],
      validAddresses: [],
    };

    dto.addresses.forEach((address) =>
      this.isAddressValid(address)
        ? response.validAddresses.push(address)
        : response.invalidAddresses.push(address),
    );

    return response;
  }

  isAddressValid(address: string): boolean {
    return this.web3.utils.isAddress(address);
  }

  async getCurrentEthPrice(): Promise<number> {
    const response: AxiosResponse<IGetEthereumPriceResponse> =
      await lastValueFrom(this.httpService.get(process.env.GET_ETH_PRICE_URL));
    const price = response.data.ethereum.usd;
    this.logger.debug(`Ethereum Price (USD): ${price}`);
    return price;
  }
}
