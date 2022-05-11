import {  INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { UserService } from "./services/user.service"
import { UsersModule } from "./users.module"
import * as request from 'supertest';
import { CreateUserStubDtTO, UpdateUserStubDTO } from "./dtos/user.stub.dto";

describe("User Controller", ()=>{
    let app: INestApplication
    let userService: UserService = new UserService()

    beforeAll(async ()=>{
        const moduleRef = await Test.createTestingModule({
            imports: [UsersModule]
        })
        .overrideProvider(UserService)
        .useValue(userService)
        .compile()

        app = moduleRef.createNestApplication();
        await app.init()
    })
    it('/GET All user', ()=>{
        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect(
                 userService.findAll()
            )
    })
    it('/GET find one User', ()=>{
        let userId = 1
        return request(app.getHttpServer())
            .get(`/users/${userId}`)
            .expect(200)
            .expect(userService.findOne(userId))
    })
    it('/POST create new user', ()=>{
        return request(app.getHttpServer())
            .post('/users')
            .send(CreateUserStubDtTO())
            .expect(201)
    })

    it('/PUT update user', ()=>{
        return request(app.getHttpServer())
            .put('/users/2')
            .send(UpdateUserStubDTO())
            .expect(200)
            .expect(userService.update(2, UpdateUserStubDTO()))     
    })

    it('/DELETE user', ()=>{
        return request(app.getHttpServer())
            .put('/users/2')
            .expect(200)
    })

    afterAll(async()=>{
        await app.close()
    })
})

