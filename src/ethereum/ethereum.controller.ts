import { Body, Controller, Post } from '@nestjs/common';
import {
  SortBalancesRequest,
  SortBalancesResponse,
} from '@/ethereum/ethereum.dto';
import { EthereumService } from '@/ethereum/ethereum.service';

@Controller('ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Post('sort_balances')
  public async sortBalances(
    @Body() dto: SortBalancesRequest,
  ): Promise<SortBalancesResponse> {
    return this.ethereumService.sortBalances(dto);
  }
}
