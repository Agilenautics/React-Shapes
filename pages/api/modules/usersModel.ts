import { OGM } from "@neo4j/graphql-ogm";
import driver from "../dbConnection";
import { loadFile } from "graphql-import-files";
import typeDefs from "../typeDefs";


// const typeDefs = loadFile("pages/api/sdl.graphql");


const ogm = new OGM({ typeDefs, driver });
ogm.init();
const User = ogm.model('user');


export default User
