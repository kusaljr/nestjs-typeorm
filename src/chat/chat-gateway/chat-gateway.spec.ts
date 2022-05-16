import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as io from 'socket.io-client';
import { AppModule } from '../../app.module';
import * as MockedSocket from "socket.io-mock"


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mockSocket

  let connectToSocketIO: () => io.Socket;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);
    const httpServer = app.getHttpServer();
    connectToSocketIO = () => io.connect(`http://127.0.0.1:${httpServer.address().port}`, { 
      transports: ['websocket'], 
      forceNew: true,
    });
    mockSocket = new MockedSocket()

  });

  afterEach(async () => {
    await app.close();
  });


  it('should connect and disconnect', (done) => {
    const socket = connectToSocketIO();

    socket.on('connect', () => {
      socket.disconnect();
    });

    socket.on('disconnect', (reason) => {
      expect(reason).toBe('io client disconnect');
      done();
    });
    socket.on('error', done);
  });

  it('should return the payload emitted', (done) => {
    const socket = connectToSocketIO();
    
    socket.on('connect', () => {
      socket.emit('echo', 'Test', (payload) => {
        try {
          expect(payload).toBe('Test');
          socket.disconnect();
        } catch (error) {
          socket.disconnect()
          done(error)
        }
      });
    });

    socket.on('disconnect', (reason) => {
      expect(reason).toBe('io client disconnect');
      done();
    });
    socket.on('error', done);
  });


  it('should return emit message when message is emitted', (done) => {
    const socket = connectToSocketIO();
    let msg: string = 'Test'
    socket.on('connect', () => {
      socket.emit('message', msg);
    });

    socket.on('message', (message) => {
      try {
        expect(message).toBe(msg)
        socket.disconnect()
        done()
      } catch (error) {     
        socket.disconnect()
        done(error)
      }
    });
    
  });



  it('should recieve what it emitted in test-message', (done)=>{
      const socket = connectToSocketIO();
      let str: String = 'Hello World' 
      socket.on('connect', ()=>{
          socket.emit('test-message', str)
      })

      socket.on('test', (message)=>{
        try {
          expect(message).toBe('Hello World')
          socket.disconnect()
          done()
        } catch (error) {
          socket.disconnect()
          done(error)    
        }
      })
      socket.on('error', done);

  })

  it('testing it with mocked socket library...', ()=>{
    mockSocket.on('message', (message: any)=>{
      expect(message).toEqual('Hello World')
    })
    mockSocket.socketClient.emit('message', 'Hello World')    
  })
});