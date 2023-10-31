import { auth } from "../../../auth";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export const sendLink = (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/verify-email?email=${email}`,
    handleCodeInApp: true,
  };

  return new Promise((resolve, reject) => {
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        const success = true;
        const msg = "Sign-in link sent successfully to user";
        resolve({ success, msg });
      })
      .catch((error) => {
        const success = false;
        const msg = "Error sending sign-in link to user. Please try again.";
        reject({ success, msg });
      });
  });
};
