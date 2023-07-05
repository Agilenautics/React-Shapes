import driver from "../dbConnection";
import { loadFile } from "graphql-import-files";
import { OGM } from '@neo4j/graphql-ogm'



const typeDefs = loadFile("src/sdl.graphql");


const ogm = new OGM({ typeDefs, driver });
ogm.init()
const Project = ogm.model("main")


export default Project
