import { CreateProductDto } from "./product.dtos";

export const CreateProductStubDtTO = (): CreateProductDto =>{
    return{
        name: 'Hello Test',
        description: 'test desctipioj',
        price: 2000,
        stock: 20,
        image: 'https://google.com'
    }
}