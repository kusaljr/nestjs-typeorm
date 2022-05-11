import { Test, TestingModule } from "@nestjs/testing";

import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, Connection, Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { User, UserSchema } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { loginDTOStub, UserDTOStub } from "./dto/create-user.stub.dto";
import { UpdateUserDTOStub } from "./dto/update-user.stub.dto";


describe("AppController", () => {
  let userController: UsersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: any;
  const mockUserService = {

  }

  // beforeEach(async ()=>{
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [UsersController],
  //     providers: [UsersService]
  //   }).overrideProvider(UsersService).useValue(mockUserService).compile()
  // })

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {provide: getModelToken(User.name), useValue: userModel},
      ],
    }).compile();
    userController = app.get<UsersController>(UsersController);
  });

  afterAll(async ()=>{
    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  describe("user", ()=>{
    it("should create user", async ()=>{
      const createdUser = await userController.create(UserDTOStub())
      expect(createdUser.name).toBe(UserDTOStub().name)
  })
    
    it("should update user", async()=>{
      const createdUser = await userController.create(UserDTOStub())
      const updatedUSer = await userController.update(createdUser.id, UpdateUserDTOStub())
      expect(updatedUSer.name).toBe(UpdateUserDTOStub().name)
    }) 

    it("should login user", async ()=>{
      const createdUser = await userController.create(UserDTOStub())
      const loginUser = await userController.login(loginDTOStub(createdUser.email, createdUser.password))
      //sign jwt and verify
      expect(loginUser.accessToken).toBe("sdan190v029hv9023h903hv09239h3v")
    })
  })
  
});
