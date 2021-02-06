import { makeStyles, createStyles, Box, Container } from "@material-ui/core";
import useWs from "../../hooks/use-ws";
import Loading from "../loading";
import ClientName from "./name";

const useStyles = makeStyles((_theme) =>
    createStyles({
        container: {
            overflowX: "auto",
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
        <Container maxWidth="sm" className={styles.container}>
            <Box width="max-content">
                {ws.connectedClients.map((client) => (
                    <Box key={client.id} display="inline-block">
                        <ClientName client={client} />
                    </Box>
                ))}
            </Box>
        </Container>
    );
}
