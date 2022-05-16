import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as io from 'socket.io-client';
import { AppModule } from '../../app.module';


describe('AppController (e2e)', () => {
  let app: INestApplication;
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
        expect(payload).toBe('Test');
        socket.disconnect();
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
    
    socket.on('connect', () => {
      socket.emit('message', 'Test');
    });

    socket.on('message', (message) => {
      expect(message).toBe('hello');
      done()
    });
    
  });



  it('should recieve what it emitted in test-message', (done)=>{
      const socket = connectToSocketIO();
      
      socket.on('connect', ()=>{
          socket.emit('test-message', 'Test')
      })

      socket.on('test', (message)=>{
        expect(message).toBe(message)
        socket.disconnect();
        done()
      })
      socket.on('error', done);

  })

  it('testing it as return instead of done', (done)=>{
    const socket = connectToSocketIO();
    socket.on('connect', ()=>{
      socket.emit('test-message', 'Test');
    });

    socket.on('test', (message)=>{
      try {
        expect(message).toEqual('hello')
        done()
      } catch (error) {
        done(error)
      }
    })

    socket.on('error', done)
  })
});