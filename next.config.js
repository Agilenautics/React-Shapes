/** @type {import('next').NextConfig} */


// next.config.js

const { withTranslation } = require('next-i18next');



module.exports = {
  ...withTranslation({
    i18n: {
      i18n: {
        defaultLocale: "en",
        defaultLocale: "en",
        locales: ["en", "ar", "fr"]
      }
    }
  }),
  // ...nextConfig,
  env: {
    // firebase env's
    apiKey: "AIzaSyCRTufqYpj4_3HdEYqzU4EQ3zTu-oQmTyw",
    authDomain: "react-flow-f9455.firebaseapp.com",
    projectId: "react-flow-f9455",
    storageBucket: "react-flow-f9455.appspot.com",
    messagingSenderId: "715694870988",
    appId: "1:715694870988:web:a79f88f5ecfd27b9004d69",
    measurementId: "G-JG4RFPR5TB",
    //data base instance
    USER_NAME: 'neo4j',
    GRAPHQL_API_KEY: "user:fp.bf3c20e1-856e-4104-bae4-3095c7bb791d:pexWqkFMreZeDucahp4RFw",
    DB_URL: "neo4j+s://8416c941.databases.neo4j.io",
    DB_PASSWORD: "cY6q4ZLzKF0IFA-6_pLI-9UYib4cv2Ahbv7b4Mx6Dnk",
    BASE_URL: "http://localhost:3000/api/graphql",
    API_URL: "https://react-flow-agile-livid.vercel.app/api/graphql"
  },
  webpack: (config) => {
    config.experiments = { topLevelAwait: true, layers: true }
    return config;
  },
};
