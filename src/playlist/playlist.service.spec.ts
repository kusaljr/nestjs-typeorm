import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection } from 'mongoose';
import { CreatePlayListStub } from './dto/create.stub.dto';
import { Playlist, PlaylistSchema } from './entities/playlist.entity';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
  let service: PlaylistService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let playlistService: PlaylistService
  let playlistController: PlaylistController;

  let playlistModel: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    playlistModel = mongoConnection.model(Playlist.name, PlaylistSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistController],
      providers: [
        PlaylistService,
        {provide: getModelToken(Playlist.name), useValue: playlistModel},
      ],
    }).compile();
    playlistController = app.get<PlaylistController>(PlaylistController);

  });

  afterAll(async ()=>{
    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })
  

  describe('Playlist', () => {
    it("throws an error when no title is provided", async ()=>{
      try {
        const createPlaylist = await playlistController.createPlaylist(CreatePlayListStub())
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException)
        expect(e.message).toBe("Title is required! It cannot be empty!")
      }
    })
    

  });
});


