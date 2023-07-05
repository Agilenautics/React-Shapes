import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  // @ts-ignore
  process.env.DB_URL,
  // @ts-ignore
  neo4j.auth.basic(process.env.USER_NAME, process.env.DB_PASSWORD)
);

export default driver;
