import { IconButton } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import Loading from "../loading";
import Avatar from "./avatar";
import Login from "./login";

const logout = () => auth.signOut();

export default function Auth() {
    const [user, isLoading, error] = useAuthState(auth);

    if (error) {
        console.error(error);
    }

    if (isLoading || error) {
        return <Loading />;
    }

    return user ? (
        <IconButton onClick={logout}>
            <Avatar user={user} />
        </IconButton>
    ) : (
        <Login />
    );
}
