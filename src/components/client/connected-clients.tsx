import { createStyles, makeStyles, Box } from "@material-ui/core";
import ClientName from "./name";

export interface ConnectedClientsProps {
    names: string[];
}

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

export default function ConnectedClients({ names }: ConnectedClientsProps) {
    const styles = useStyles();

    return (
        <Box maxWidth="sm" className={styles.container}>
            <Box width="max-content" className={styles.scrollable}>
                {names.map((name, i) => (
                    <Box key={i} display="inline-block">
                        <ClientName name={name} size="small" />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
