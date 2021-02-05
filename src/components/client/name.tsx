import {
    createStyles,
    makeStyles,
    Avatar,
    Box,
    Typography,
} from "@material-ui/core";
import Client from "../../../lib/client";
import Loading from "../loading";

export interface ClientNameProps {
    client: Client;
}

const useStyles = makeStyles((_theme) =>
    createStyles({
        wrapper: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: 128,
        },
        name: {
            display: "block",
            fontSize: 14,
            letterSpacing: 2,
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: 1.2,
            paddingTop: 4,
        },
    }),
);

export default function ClientName({ client }: ClientNameProps) {
    const styles = useStyles();

    const avatarLetters =
        client.name &&
        client.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2);

    return (
        <>
            {client.name && avatarLetters ? (
                <Box className={styles.wrapper}>
                    <Avatar>{avatarLetters}</Avatar>
                    <Typography className={styles.name}>
                        {client.name}
                    </Typography>
                </Box>
            ) : (
                <Loading />
            )}
        </>
    );
}
