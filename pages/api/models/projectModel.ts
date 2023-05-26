import { OGM } from "@neo4j/graphql-ogm";
import driver from "../dbConnection";
import { loadFile } from "graphql-import-files";



const typeDefs = loadFile("pages/api/sdl.graphql");


const ogm = new OGM({typeDefs,driver});
ogm.init()
const Project = ogm.model("main")


export default Project
