// import { ApolloServer } from "apollo-server-micro";
// import { Neo4jGraphQL } from "@neo4j/graphql";
// import dotenv from "dotenv";
// import EventEmitter from "events";
// import resolvers from "./resolvers";
// import driver from "./dbConnection";
// import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
// import typeDefs from "./typeDefs";

// // ? The function below takes the path from the root directory
// // ? The file referrenced here contains the schema for GraphQL
// //const typeDefs = loadFile("pages/api/sdl.graphql");

// EventEmitter.defaultMaxListeners = 15;

// dotenv.config();

// // ? Here we provide authentication details for the Neo4j server
// // * This server is currently for development only, we will need to change
// // * to another server before production
// // const driver = neo4j.driver(
// //   // @ts-ignore
// //   process.env.DB_URL,
// //   // @ts-ignore
// //   neo4j.auth.basic(process.env.USER_NAME, process.env.DB_PASSWORD)
// // );

// // @ts-ignore
// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "*"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   if (req.method === "OPTIONS") {
//     res.end();
//     return false;
//   }

//   const neoSchema = new Neo4jGraphQL({ typeDefs, driver, resolvers });
//   const apolloServer = new ApolloServer({
//     schema: await neoSchema.getSchema(),
//     introspection: true,
//     plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
//   });
//   await apolloServer.start();
//   await apolloServer.createHandler({
//     // ? This is path on which the Apollo server is located
//     path: "/api/graphql",
//   })(req, res);
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };






// npm install @apollo/server express graphql cors body-parser
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import express from 'express';
// import http from 'http';
// import cors from 'cors';
// import pkg from 'body-parser';
// const { json } = pkg;
// import resolvers from './resolvers';
// import typeDefs from './typeDefs'
// import { Neo4jGraphQL } from '@neo4j/graphql';
// import driver from './dbConnection';

// interface MyContext {
//   token?: String;
// }

// const app = express();
// const httpServer = http.createServer(app);
// const neoSchema = new Neo4jGraphQL({typeDefs,driver,resolvers})


// export default async function createApolloServer(){
//   const server = new ApolloServer<MyContext>({
//     schema:await neoSchema.getSchema(),
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   });
//   await server.start();
//   app.use(
//     '/api/graphql',
//     cors<cors.CorsRequest>(),
//     json(),
//     expressMiddleware(server, {
//       context: async ({ req }) => ({ token: req.headers.token }),
//     }),
//   );

//   await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
//   console.log(`🚀 Server ready at http://localhost:3000/graphql`);



// }


import { ApolloServer } from "@apollo/server";
import driver from "./dbConnection";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import express from 'express'
import dotenv from 'dotenv'
import http from "http"
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import { Neo4jGraphQL } from "@neo4j/graphql";
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

dotenv.config()

const app = express();
const httpServer = http.createServer(app)

const neoSchema = new Neo4jGraphQL({ driver, resolvers, typeDefs });
const server = new ApolloServer({
  schema: await neoSchema.getSchema(),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = server.start()



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  await startServer;
  if (req.method === "OPTIONS") {
    console.log("hi iam in request method options")
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST"); //this field i have newly
    res.end();
    return false;
  }
  app.use(cors());



  // app.use('/',(req,res)=>{
  //   return res.send('hello')
  // })






  app.use(
    '/api/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    }),
  )(req, res);
}
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// import { ApolloServer } from "apollo-server-micro";
// import typeDefs from "./typeDefs";
// import resolvers from "./resolvers";
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { Neo4jGraphQL } from "@neo4j/graphql";
// import Cors from 'micro-cors'
// // import cors from 'cors'
// import dotenv from 'dotenv'
// import driver from "./dbConnection";
// dotenv.config()

// const cors = Cors()
// const neoSchema = new Neo4jGraphQL({ typeDefs, driver, resolvers })
// const apolloServer = new ApolloServer({
//   schema: await neoSchema.getSchema()
// });

// const startServer = apolloServer.start()


// export default cors(async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === "OPTIONS") {
//       console.log("hi")
//       res.end();
//       return false;
//     }
//     await startServer;
//     await apolloServer.createHandler({
//       path: '/api/graphql'
//     })(req, res);
//   }
// );
// export const config = {
//   api: {
//     bodyParser: false,
//     // externalResolver: true,
//   },
// };



