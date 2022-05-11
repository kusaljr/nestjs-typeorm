import { CreateUserDto } from "./create-user.dto";


export const UserDTOStub = (): CreateUserDto=>{
    return{
        name: "test full name",
        email: "test@gmail.com",
        password: "test123"
    }
}

export const loginDTOStub = (email: string, password: string)=>{
    return{
        email,
        password 
    }
}
