import Web3 from 'web3';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import {
  GetSortedBalancesRequest,
  GetSortedBalancesResponse,
  Wallet,
} from '@/ethereum/ethereum.dto';
import { IGetEthereumPriceResponse } from '@/ethereum/ethereum.interface';
import { AbiItem } from 'web3-utils';

@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);
  private web3: Web3;

  constructor(private readonly httpService: HttpService) {
    this.web3 = new Web3(process.env.ETH_NODE_URL);
  }

  async getSortedBalances(
    dto: GetSortedBalancesRequest,
  ): Promise<GetSortedBalancesResponse> {
    const invalidAddresses: string[] = [];

    const promises: Promise<Wallet>[] = [];

    const ethereumPrice = await this.getEthereumPrice();

    dto.addresses.forEach((address) => {
      this.web3.utils.isAddress(address)
        ? promises.push(this.getWalletDetails(address, ethereumPrice))
        : invalidAddresses.push(address);
    });

    const wallets = await Promise.all(promises);

    const sortedAddresses = wallets.sort(
      (a, b) => b.total_usd_value - a.total_usd_value,
    );

    return {
      wrong_addresses: invalidAddresses,
      sorted_addresses: sortedAddresses,
    };
  }

  async getWalletDetails(
    address: string,
    ethereumPrice: number,
  ): Promise<Wallet> {
    const wallet = new Wallet();
    wallet.address = address;
    wallet.eth_balance = await this.getEthereumBalance(address);
    wallet.usdt_balance = await this.getUsdtBalance(address);
    wallet.eth_usd_value = wallet.eth_balance * ethereumPrice;
    wallet.total_usd_value = wallet.eth_usd_value + wallet.eth_usd_value;
    return wallet;
  }

  async getEthereumBalance(address: string): Promise<number> {
    const wei = await this.web3.eth.getBalance(address);
    return parseInt(this.web3.utils.fromWei(wei, 'ether'));
  }

  async getUsdtBalance(address: string): Promise<any> {
    const abiJson: AbiItem[] = [
      {
        constant: true,
        inputs: [{ name: 'who', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        type: 'function',
        stateMutability: 'view',
      },
    ];

    const contract = new this.web3.eth.Contract(
      abiJson,
      process.env.USDT_CONTRACT,
    );

    const balance = await contract.methods.balanceOf(address).call();

    return balance / Math.pow(10, 6);
  }

  async getEthereumPrice(): Promise<number> {
    const response: AxiosResponse<IGetEthereumPriceResponse> =
      await lastValueFrom(this.httpService.get(process.env.GET_ETH_PRICE_URL));
    const price = response.data.ethereum.usd;
    this.logger.debug(`Ethereum Price (USD): ${price}`);
    return price;
  }
}
