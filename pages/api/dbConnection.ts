import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.DB_URL as string,
  neo4j.auth.basic(
    process.env.USER_NAME as string,
    process.env.DB_PASSWORD as string
  )
);

export default driver;
