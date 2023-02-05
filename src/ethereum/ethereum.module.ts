import { Module } from '@nestjs/common';
import { EthereumService } from '@/ethereum/ethereum.service';
import { EthereumController } from '@/ethereum/ethereum.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EthereumService],
  controllers: [EthereumController],
})
export class EthereumModule {}
