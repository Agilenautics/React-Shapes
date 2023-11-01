import { ApolloServer } from "apollo-server-micro";
import { Neo4jGraphQL } from "@neo4j/graphql";
import EventEmitter from "events";
import driver from "./dbConnection";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import typeDefs from "./typeDefs";
import { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "../../authMiddleware";
import { verify } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";

import { Neo4jGraphQLAuthJWKSPlugin } from "@neo4j/graphql-plugin-auth";

// ? The function below takes the path from the root directory
// ? The file referrenced here contains the schema for GraphQL
//const typeDefs = loadFile("pages/api/sdl.graphql");

EventEmitter.defaultMaxListeners = 15;

// ? Here we provide authentication details for the Neo4j server
// * This server is currently for development only, we will need to change
// * to another server before production
function getTokenFromHeader(header: string | undefined): string | null {
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1]; // Return the token part
  }
  return null;
}


const neoSchema = new Neo4jGraphQL({ typeDefs, driver,
  plugins: {
    auth: new Neo4jGraphQLAuthJWTPlugin({
        secret: "super-secret",
        // jwksEndpoint: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys",
        globalAuthentication: true,
    })
}
});

const apolloServer = new ApolloServer({
  schema: await neoSchema.getSchema(),
  introspection: true,
  persistedQueries: false,
  context: ({ req }) => {
    const token = getTokenFromHeader(req.headers.authorization);
    if (!token) throw new Error("No token provided");
    return { token };
},
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed : true })],

  formatError: (err) => {
    console.error(err.message);
    return err;
  },
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
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

    if (res.writableEnded) return;  
    await apolloServer.createHandler({
      path: '/api/graphql',
    })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
