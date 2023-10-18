/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination:
//           "https://ssrreactflowf9455-n7cidehgba-uc.a.run.app/api/graphql",
//       },
//     ];
//   },
// };


// # DB_URL = "neo4j+s://77c4b64b.databases.neo4j.io"
// # DB_PASSWORD = "Iu4am2zvXvKYSvhtm3aEPP-WKv5a96IrP4NIvcgGoPo"
// # USER_NAME= "neo4j"
// # GRAPHQL_API_KEY="user:fp.bf3c20e1-856e-4104-bae4-3095c7bb791d:pexWqkFMreZeDucahp4RFw"
// # BASE_URL="http://localhost:3000"
// # API_URL="https://react-flow-agile-beppbh0ua-irfan-agilenautics.vercel.app/api/graphql"
// # NODE_ENV="production"

// # DB_URL = "neo4j+s://80f988e4.databases.neo4j.io"
// # DB_PASSWORD = "gTSRszBHsxaBr3NQ4cNTlF1FYjriEqDgm7x9AxQHhxQ"
// # USER_NAME= "neo4j"
// # GRAPHQL_API_KEY="user:fp.bf3c20e1-856e-4104-bae4-3095c7bb791d:pexWqkFMreZeDucahp4RFw"
// # BASE_URL="http://localhost:3000"
// # API_URL="http://localhost:3000/api/graphql"

module.exports = {
  // ...nextConfig,
  env: {
    // DB_PASSWORD:"JTqKzr5_U4iRErGDGADJELjuoDQNubC9ZMhbzOlcYYY",
    // DB_URL:"neo4j+s://b53cefae.databases.neo4j.io",
    USER_NAME:'neo4j',
    GRAPHQL_API_KEY:"user:fp.bf3c20e1-856e-4104-bae4-3095c7bb791d:pexWqkFMreZeDucahp4RFw",
    DB_URL: "neo4j+s://77c4b64b.databases.neo4j.io",
    DB_PASSWORD: "Iu4am2zvXvKYSvhtm3aEPP-WKv5a96IrP4NIvcgGoPo",
  },
  webpack: (config) => {

    config.experiments = { topLevelAwait: true, layers: true }
    return config;
  },
};
