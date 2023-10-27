import { ApolloServer } from "apollo-server-micro";
import { Neo4jGraphQL } from "@neo4j/graphql";
import EventEmitter from "events";
import driver from "./dbConnection";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import typeDefs from "./typeDefs";
import { NextApiRequest, NextApiResponse } from "next";

// ? The function below takes the path from the root directory
// ? The file referrenced here contains the schema for GraphQL
//const typeDefs = loadFile("pages/api/sdl.graphql");

EventEmitter.defaultMaxListeners = 15;

// ? Here we provide authentication details for the Neo4j server
// * This server is currently for development only, we will need to change
// * to another server before production

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
const apolloServer = new ApolloServer({
  schema: await neoSchema.getSchema(),
  introspection: true,
  persistedQueries: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

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
