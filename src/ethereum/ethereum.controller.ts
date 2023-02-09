import { Body, Controller, Post } from '@nestjs/common';
import {
  GetSortedBalancesRequest,
  GetSortedBalancesResponse,
} from '@/ethereum/ethereum.dto';
import { EthereumService } from '@/ethereum/ethereum.service';

@Controller('ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Post('sort_balances')
  public async getSortedBalances(
    @Body() dto: GetSortedBalancesRequest,
  ): Promise<GetSortedBalancesResponse> {
    return this.ethereumService.getSortedBalances(dto);
  }
}
