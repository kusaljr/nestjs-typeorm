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
    return { event: 'message', data: 'hello' };
  }

  @SubscribeMessage('test-message')
  handleTestMessages(payload: any){
    this.server.emit('test', "this is test")
  }
}