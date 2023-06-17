import { ApolloServer } from "apollo-server-micro";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { loadFile } from "graphql-import-files";
import dotenv from 'dotenv';
import EventEmitter from "events";
import resolvers from "./resolvers";
import driver from "./dbConnection";
import { gql } from "@apollo/client";
import typeDefs from "./typeDefs";

// ? The function below takes the path from the root directory
// ? The file referrenced here contains the schema for GraphQL
// const typeDefs = loadFile("pages/api/sdl.graphql");


EventEmitter.defaultMaxListeners = 15


dotenv.config()

// ? Here we provide authentication details for the Neo4j server
// * This server is currently for development only, we will need to change
// * to another server before production
// const driver = neo4j.driver(
//   // @ts-ignore
//   process.env.DB_URL,
//   // @ts-ignore
//   neo4j.auth.basic(process.env.USER_NAME, process.env.DB_PASSWORD)
// );


// @ts-ignore
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    // "https://studio.apollographql.com",
    "https://ssrreactflowf9455-n7cidehgba-uc.a.run.app/"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  const neoSchema = new Neo4jGraphQL({ typeDefs, driver,resolvers });
  const apolloServer = new ApolloServer({
    schema: await neoSchema.getSchema(),
  });
  await apolloServer.start();
  await apolloServer.createHandler({
    // ? This is path on which the Apollo server is located
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
