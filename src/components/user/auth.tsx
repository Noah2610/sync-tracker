import { Button } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import Loading from "../loading";
import ClientName from "../client/name";
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
        <Button variant="text" onClick={logout}>
            <ClientName
                name={user.displayName || "USER"}
                avatarSrc={user.photoURL || undefined}
            />
        </Button>
    ) : (
        <Login />
    );
}
