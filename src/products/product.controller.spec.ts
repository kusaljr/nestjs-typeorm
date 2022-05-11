import {  BadGatewayException, INestApplication, NotFoundException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { ProductsModule } from "./products.module"
import { ProductService } from "./services/product.service"
import * as request from 'supertest';
import { CreateProductStubDtTO } from "./dtos/product.stub.dtos";
import { ProductController } from "./controllers/product.controller";

describe("Product Controller", ()=>{
    let app: INestApplication
    let productService: ProductService = new ProductService()
    let controller:ProductController = new ProductController(productService)

    beforeAll(async ()=>{
        const moduleRef = await Test.createTestingModule({
            imports: [ProductsModule]
        })
        .overrideProvider(ProductService)
        .useValue(productService)
        .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it('/GET all products', ()=>{
        return request(app.getHttpServer())
            .get('/products')
            .expect(200)
            .expect(productService.findAll())
    })

    it('/POST new product',async  ()=>{
        const {body} = await  request(app.getHttpServer())
            .post('/products')
            .send(CreateProductStubDtTO())
            .expect(201)
        expect(body).toEqual(
            {id: expect.any(Number), ...CreateProductStubDtTO()}
        )
    })

    it('/EDIT new product', ()=>{
        return request(app.getHttpServer())
            .put('/products/2')
            .send({name: 'Test Hello'})
            .expect(200)
    })

    it('/EDIT should return not found exception', ()=>{
        try {
            controller.update(4, {name: 'sk'})
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException)
        }
    })

    it('/DELETE the product', async ()=>{
        return request(app.getHttpServer())
            .delete('/products/2')
            .expect(200)
    })

    it('/DELETE should return not found exception', ()=>{
        try {
            controller.delete(3)
        } catch (error:any) {
            expect(error).toBeInstanceOf(NotFoundException)
        }
                
    })

    afterAll(async ()=>{
        await app.close()
    })
})
