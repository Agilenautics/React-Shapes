import { auth } from "../auth";
import { onAuthStateChanged } from "firebase/auth";

const verifyAuthToken = async () => {
  let users = {};
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      users = user;
    } else {
    }
  });
  return users;
};

export default verifyAuthToken;
