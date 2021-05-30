import firebase from "firebase/app";
import { Avatar } from "@material-ui/core";

export default function UserAvatar({ user }: { user: firebase.User }) {
    return (
        <Avatar
            src={user.photoURL || undefined}
            alt={user.displayName || undefined}
        />
    );
}
