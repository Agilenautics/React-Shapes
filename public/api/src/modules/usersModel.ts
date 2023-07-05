import { OGM } from "@neo4j/graphql-ogm";
import driver from "../dbConnection";
import { loadFile } from "graphql-import-files";



const typeDefs = loadFile("src/sdl.graphql");


const ogm = new OGM({ typeDefs, driver });
ogm.init();
const User = ogm.model('user');


export default User
