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
  serverRuntimeConfig : {
    FIREBASE_SERVICE_ACCOUNT_KEY : `{
    "type": "service_account",
    "project_id": "react-flow-f9455",
    "private_key_id": "caa6f497f7b7aa96cb91b9d50f3380da8638be9f",
    "private_key": "-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdcuY7PfFcwia0KWWxQYH0k1dVAlpfh7M4aDbziBki358AhYCtKAY4ZwLAI8x0xdr6lGJwDTPxI+A7J3oVlFI0Oc+t7NG/OMnQeLPiuzXGYxk6RrCW31zRwmmbe2RQYIIuhSXUvVkW5v4zvvlynVBmyWf3GE0C5J5uLGUDjOi9lYXrr55N9OuJZlkT1Dy6svsNRR6Phzd60NhTh77VHAQLjJjuSC9kg5DSiek1n2xtIlsHEZlApiNS7MBcSD3YZeaK3KJcxbWrpsoslwp8/B6SkbUKSywUi62z433Bv32NOR90uCRHqDVFhyDA+Fmtnt6ZgJNhFcqB+AHH9rgvwLO9AgMBAAECggEANTLO3sJxrG0/RY1dOlSPc9Na5TK71V5U7GCt/IAGOjXDlBoHnboRy/nmQIR3/xahBByh3Alh/P6ps2MFyYfJdLL53GLRheJKskEuSpQFuefe7MVYwklrI8akBzBcdxn8snozi5uEoAvhZRuITjUgJvKzSZZw4uLbMw+V++qe8vssPIJP1nnzd1lLe1iLjWsG/TmqO71y+c/nB0MOU32MlujYUscFLoibFIr/nZuftwdSfU0Q7A3/pPO3XWmLpiESpHKScUZqm6SeP+8DdO0/8rwIoIJmnUohwjEMQbqdyu+gA3gDJbHboPfCR+qAR6FknRbq+VJePskO/SGp/nKeswKBgQDPVWy8dqPEdUIrG86OqnasCdD0olrfzqCTlk385B190/lB43JobkRk/lmt3wq1ZZUBvrXJGtDKZVNoBmxSY980Wel+k28PP3GtG27DJsJC87rspGolINLGR+rEr3s+jqN+3GvlIY/9orNXBnZoSusVmfzis43SrL70WUg2pv0RGwKBgQDCZ+sqS8jVEsenRrwRFVstbokLGDB9iB6pu9fV1Ns3WUbH2krceelBMRjcB0mPKmKG2sEegDHZnRoIO9wI3rj3OirKKvAMR6BBhKL85v1psvGWppLkGW5nlqsdZl++WW5xKj43U082/xXDdGeMB3YTYyP84oi97Zb/2JWCf490BwKBgGE5YcAOskUR53FnnLjx3qxV/hJ5f7urnUkYFoIcRmgW2q+3BJNMAe6KB2utR8xAUlt7HqurU3VVhoMlX+5SvvxBnWipok64JYpTbuE8b6QNvv3xK4U1myE34DNTRqvTH4ABxOaxkmARx59rfGLznsGGcDuujzbXosPaii52p/05AoGAW8UkjQXTW0oPN5a7hrD3Jp4sUTFtCoUsPGGxBH8DsMATGpqghi2Cf8TGgG9sOQoAErrHOTe40IpJ1KM1PnatB//MXT0hrhpNuz/6lLoR3EidpMkjREwBAyNryWgfQEMFUKRpVEKefU6zHl4f10laYtKFFYZ2mHnEsyexhDXlKRcCgYEAkJUdapEnTfXqGQxwyfW1EGen2Q/kur3PsT7FWOzw2njGm8A1aVWW2tBZYqaKvb2Sol+HX17haQc+xgecyzn60a5urKTu2QQ2JNyz4E+EONTBxFFkfnZdhK3tcUG3cH3IDXFDsoGTB5TzAwXpcA9w2QTqcnTQn/e941HSCyGOxTw=-----END PRIVATE KEY-----",
    "client_email": "firebase-adminsdk-x3ung@react-flow-f9455.iam.gserviceaccount.com",
    "client_id": "114575380097836548233",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-x3ung%40react-flow-f9455.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
    }`
  },
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
    DB_URL: "neo4j+s://df53dad9.databases.neo4j.io",
    DB_PASSWORD: "PxWzvlOWBvDHaqDwnpk1S_3YEX-Ut1uwbaJI-j7gY4U",
    BASE_URL: "http://localhost:3000/api/graphql",
    API_URL: "https://react-flow-agile-omega.vercel.app/api/graphql"
  },
  webpack: (config) => {
    config.experiments = { topLevelAwait: true, layers: true }
    return config;
  },
  // api: {
  //   bodyParser: false,
  // },
};
