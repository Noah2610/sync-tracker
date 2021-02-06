import {
    createStyles,
    makeStyles,
    AppBar,
    Box,
    Button,
    Toolbar,
} from "@material-ui/core";
import { useState } from "react";
import { useWs } from "../../ws/ws-context";
import {
    ClientChangeNameDialog,
    ClientName,
    ConnectedClients,
} from "../client";
import Loading from "../loading";

const useStyles = makeStyles((_theme) =>
    createStyles({
        toolbar: {
            justifyContent: "flex-end",
        },
    }),
);

export default function Navigation() {
    const ws = useWs();
    const styles = useStyles();
    const [isClientMenuOpen, setClientMenuOpen] = useState(false);
    const toggleClientMenu = () => setClientMenuOpen((prev) => !prev);

    return (
        <>
            <AppBar position="relative">
                <Toolbar className={styles.toolbar}>
                    <Box>
                        <ConnectedClients />
                    </Box>
                    <Box marginLeft={4}>
                        {ws && ws.client ? (
                            <Button variant="text" onClick={toggleClientMenu}>
                                <ClientName client={ws.client} />
                            </Button>
                        ) : (
                            <Loading />
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <ClientChangeNameDialog
                open={isClientMenuOpen}
                onClose={() => setClientMenuOpen(false)}
            />
        </>
    );
}
