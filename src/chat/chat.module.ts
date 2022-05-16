import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AppGateway } from './chat-gateway/chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatService,AppGateway]
})
export class ChatModule {}
