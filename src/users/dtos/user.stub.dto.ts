import { CreateUserDto, UpdateUserDto } from "./user.dtos";

export const CreateUserStubDtTO = (): CreateUserDto =>{
    return{
        email: 'test@gmail.com',
        password: 'test213',
        role: 'admin'
    }
}

export const UpdateUserStubDTO = (): UpdateUserDto =>{
    return{
        email: "testanother@gmail.com"
    }
}