import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';

import { AppController } from './app.controller';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    ChatModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
