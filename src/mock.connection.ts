import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, Connection } from "mongoose";

export default class MockConnection {
    
    async mockConnect(){
        let mongod: MongoMemoryServer
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri()
        let mongoConnection: Connection
        mongoConnection = (await connect(uri)).connection
        
    }

    
}