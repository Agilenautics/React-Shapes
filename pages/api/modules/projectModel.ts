import driver from "../dbConnection";
import { loadFile } from "graphql-import-files";
import { OGM } from '@neo4j/graphql-ogm'
import { gql } from "@apollo/client";
import typeDefs from "../typeDefs";



// const typeDefs = loadFile("pages/api/sdl.graphql");



const ogm = new OGM({ typeDefs, driver });
ogm.init()
const Project = ogm.model("main")


export default Project
