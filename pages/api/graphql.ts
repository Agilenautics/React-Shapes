import { ApolloServer } from "apollo-server-micro";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { loadFile } from "graphql-import-files";

// ? The function below takes the path from the root directory
// ? The file referrenced here contains the schema for GraphQL
const typeDefs = loadFile("pages/api/sdl.graphql");

// ? Here we provide authentication details for the Neo4j server
// * This server is currently for development only, we will need to change
// * to another server before production
const driver = neo4j.driver(
  "neo4j+s://77c4b64b.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "Iu4am2zvXvKYSvhtm3aEPP-WKv5a96IrP4NIvcgGoPo")
);
// @ts-ignore
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
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
