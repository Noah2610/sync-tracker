import { createStyles, makeStyles, Box } from "@material-ui/core";
import useWs from "../../hooks/use-ws";
import Loading from "../loading";
import ClientName from "./name";

const useStyles = makeStyles((_theme) =>
    createStyles({
        container: {
            overflowX: "auto",
        },
        scrollable: {
            marginLeft: "auto",
        },
    }),
);

export default function ConnectedClients() {
    const ws = useWs();
    const styles = useStyles();

    if (!ws) {
        return <Loading />;
    }

    return (
        <Box maxWidth="sm" className={styles.container}>
            <Box width="max-content" className={styles.scrollable}>
                {ws.connectedClients.map((client) => (
                    <Box key={client.id} display="inline-block">
                        <ClientName client={client} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
