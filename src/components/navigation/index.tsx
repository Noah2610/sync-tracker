import {
    createStyles,
    makeStyles,
    AppBar,
    Box,
    Button,
    Container,
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
import Auth from "../user/auth";

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
                <Container maxWidth="md">
                    <Toolbar className={styles.toolbar}>
                        <Auth />
                        {/*
                            <Box>
                                {ws && ws.client ? (
                                    <Button
                                        variant="text"
                                        onClick={toggleClientMenu}
                                    >
                                        <ClientName client={ws.client} />
                                    </Button>
                                ) : (
                                    <Loading />
                                )}
                            </Box>
                        */}
                    </Toolbar>
                </Container>
            </AppBar>

            <ClientChangeNameDialog
                open={isClientMenuOpen}
                onClose={() => setClientMenuOpen(false)}
            />
        </>
    );
}
