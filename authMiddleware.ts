// import { NextApiRequest, NextApiResponse } from 'next';
// import admin from './firebaseAdmin';

// const authMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
//   const token = req.headers.authorization as string;
//   const cleanToken = token?.replace('Bearer ', '');
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(cleanToken);
//     // console.log(decodedToken,token)
//     (req as any).decodedToken = decodedToken;  // Add decoded token to the request object
//     next();
//   } catch (error : any) {
//     res.status(403).send('Unauthorized');
//   }
// };

// export default authMiddleware;
