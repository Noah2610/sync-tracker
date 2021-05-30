import firebase from "firebase/app";
import { Button } from "@material-ui/core";
import { auth } from "../../firebase";

const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
};

export default function Login() {
    return (
        <>
            <Button variant="contained" color="secondary" onClick={signIn}>
                Login
            </Button>
        </>
    );
}
