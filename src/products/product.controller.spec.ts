import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { ProductsModule } from "./products.module"
import { ProductService } from "./services/product.service"
import * as request from 'supertest';
import { CreateProductStubDtTO } from "./dtos/product.stub.dtos";

describe("Product Controller", ()=>{
    let app: INestApplication
    let productService: ProductService = new ProductService()

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

    it('/POST new product', ()=>{
        return request(app.getHttpServer())
            .post('/products')
            .send(CreateProductStubDtTO())
            .expect(201)
            .expect((res)=>{
                expect(typeof res.body.id).toBe("number")
                delete(res.body.id)
                expect(res.body).toStrictEqual(CreateProductStubDtTO())
            })
    })

    it('/EDIT new product', ()=>{
        return request(app.getHttpServer())
            .put('/products/2')
            .send({name: 'Test Hello'})
            .expect(200)
            .expect((res)=>{
                
            })
    })

    afterAll(async ()=>{
        await app.close()
    })
})
