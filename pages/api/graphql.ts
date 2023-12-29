import { ApolloServer } from "apollo-server-micro";
import { Neo4jGraphQL } from "@neo4j/graphql";
import EventEmitter from "events";
import driver from "./dbConnection";
import {
  ApolloError,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import typeDefs from "./typeDefs";
import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLError } from "graphql";
import errorHandling from "./errorHandling";
import logger from "./logger";
import { verify } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { auth } from "../../auth";
import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";
import firebaseKeys from "../../react-flow-f9455-firebase-adminsdk-x3ung-d836e27093.json";

// ? The function below takes the path from the root directory
// ? The file referrenced here contains the schema for GraphQL
//const typeDefs = loadFile("pages/api/sdl.graphql");

EventEmitter.defaultMaxListeners = 15;

// ? Here we provide authentication details for the Neo4j server
// * This server is currently for development only, we will need to change
// * to another server before production
//
function getTokenFromHeader(header: string | undefined): string | null {
  if (header && header.startsWith("Bearer")) {
    return header.split(" ")[1]; // Return the token part
  }
  return null;
}

const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  // features: {
  //   authorization: {
  //     key: firebaseKeys.private_key,
  //     // key:"-----BEGIN PRIVATE KEY-----MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIKYZh/HVAXFCbkF8OgQp57FKyNrseSi8cuj8Gew4FulvnZakVnuTn81HPtyi91AB1UJylW27uL97PyWAcOQWsqOKV4j3Xd1jP9Y5vNEdB/y5hkBZCzfLOJyx5XeLMaw/vgxsWH4KDy/yE83RHDOqdcaszbice3W/PIfhyB/fr9GYtbkAKXC9QmK9jwUn0np78bazSWRO0gwLsSivowcTSXWTSixJkHkdak8tnGANJ+2R4J6OammMJqNLgl+IuTSzDAotWNGOJj+6AsIr3QI3HUp0P+Yjq59j2tKuHwPFcNWvFNkDt+xTIYxp2Iwzw9l7ZrLQFMN3tcNOWEaOx2DBNAgMBAAECggEACRWiR4bhipC0QaXlWMhJM2/b8BeafS05NNYhz3zSRsUqTG/Xoy514vWSmMPxyooHlRKZ/snxkWSTQOxWLQcTSUzVaEpNgR6lyQiy9K4BoJloG++wMvXGYkAA6BIiHbAdXworKFMAAhvF/nOkckQxzxzatPuGNTyh15SYOy9au6xIBwbqj1tfKgdkJZifJewPzUJ7DE7Ur9Yv6ec5JQ+dX/gnUPDC8ohpy2uVrjzOuM8eIgkzF2cx/+b/ddpmbIOrLTLG/fWsr/aYaSFZgkeN9G7uFZ+xxkoP3k2yC4H0sPf7OccOKGun/Tecti21yWd2rSPTW6uXtIsUnI6SnYh0uQKBgQD2S9FpSWLgOAQTwraBN/kicibZjzFWTgBUbIp3cshtnDKZHxtOW+4wqv9CT0Afkb/UeMvGzZRgqJRjn6176ls2k665bde/Z2jHrIqRBonb9ayWCaLVjVl9wqhjz1yl7PAXkTq95srKfM7U50PFFkybAvAcIYhvYwYsf8LatdCGIwKBgQDQDGR9xppN2NfvX3NgfgUQLIQxXs103//YA3dz59duY8P/iJaBXMxlOygwMTNTBu4ssTXlbqG1CQi1OCYbFFBRMA7km1Kj1uWdAxWz21DeCf5m39GsrDwjvrqj132K98Csld0bcvqgP5Bu+9CwzDEmdRMw0zRQnbk30yaFFBf+zwKBgQDkpO36+A26aUYfshsLSpMVzzMRtUTwAel8dmb1DLHUT7UJQT9wNxegRp5BSKEWrY+QB7PlEuQz90wKUCoVZzLWL7N8oOQw5Cb5dswMZi2E7UUS5E8uQNJbVWJNhitUPemFd2U49hA8ejDopOjdBh6HqOqOsvKdtSf+F30k3LSAUQKBgQCO9UUELDkRbwSKJpOYZV/DSmOXrSYOvnEGFPO7AD9HSmR+rXOF9qc4lFq8KsKytZtpuGdpfQi+5jNGmwuMJfw+nYBOU/CIRn1G07zQ9s3tlP5r4DYqqbs1cLS9KrDIkg+iR+REHVDcVnE/4eb35YeMfnwuW6KiFo8ULhJU9Ya7fwKBgAOxOq8D0ZzHiVBb6NZR2UKPTzeamunbMiDJh/kkcse+Jytcz4Owt/U5T5N9Hc+ZhEiowiKwmophm+ekA2iX8OXQL1M8yiqchYtOMpriemOQ6iPdDnw+ptQ3OWekC8J0DGGuUgMO/i7TcXOzvTJaYuOnZf13WNyo0EMSTw/b9n2e-----END PRIVATE KEY-----",
  //   },
  // },
  // plugins: {
  //   auth: new Neo4jGraphQLAuthJWTPlugin({
  //     secret: firebaseKeys.private_key,
  //     globalAuthentication: true,
  //   }),
  // },
});

const apolloServer = new ApolloServer({
  schema: await neoSchema.getSchema(),
  formatError: (error) => {
    return errorHandling(error);
  },
  introspection: true,
  persistedQueries: false,
  // context: async ({ req }) => {
  //   const token: string | any = getTokenFromHeader(req.headers.authorization);
  //   var serviceAccount = JSON.parse(JSON.stringify(firebaseKeys));
  //   if (!admin.apps.length) {
  //     admin.initializeApp({
  //       credential: admin.credential.cert(serviceAccount),
  //     });
  //   }
  //   // todo verification by public key using jwt
  //   // todo decoding that token by using private key
  //   // const verifyToken = await jwt.decode(token);
  //   // console.log(verifyToken);
  //   //error handler
  //   // error loger
  //   const decodeToken = await admin.auth().verifyIdToken(token);
  //   // console.log(decodeToken);
  //   return { jwt: decodeToken };
  // },
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});


// neoSchema.
const startServer = apolloServer.start();
//creatin server using handler function (nextsJs syntax)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  //logger info level
  //logger?.info("server started successfully...")
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
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "500kb",
    maxDuration: 5,
  },
};
