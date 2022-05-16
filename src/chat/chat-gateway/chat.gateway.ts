import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('echo')
  handleEcho(client: any, payload: any): string {
    return payload;
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): WsResponse<any> {
    return { event: 'message', data:payload };
  }

  @SubscribeMessage('test-message')
  handleTestMessages(client:any, payload: any):void{
    this.server.emit('test', payload) 

  }
}