import { auth } from '../../../auth';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";


const sendLink = (email: string) => {
    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: `${window.location.origin}/finishSignUp?email=${email}`
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            // The link was successfully sent. Inform the user.
            console.log("Link sent successfully")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('errorMessage: ', errorMessage);
        });
}

