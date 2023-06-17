import neo4j from "neo4j-driver";


const DB_URL = "neo4j+s://77c4b64b.databases.neo4j.io"
const DB_PASSWORD = "Iu4am2zvXvKYSvhtm3aEPP-WKv5a96IrP4NIvcgGoPo"
const USER_NAME= "neo4j"

const driver = neo4j.driver(
    // @ts-ignore
    DB_URL,
    // @ts-ignore
    neo4j.auth.basic(USER_NAME, DB_PASSWORD)
);


export default driver