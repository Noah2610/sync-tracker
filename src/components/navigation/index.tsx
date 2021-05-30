import {
    createStyles,
    makeStyles,
    AppBar,
    Box,
    Container,
    Toolbar,
} from "@material-ui/core";
import { ConnectedClients } from "../client";
import Auth from "../user/auth";

const useStyles = makeStyles((_theme) =>
    createStyles({
        toolbar: {
            justifyContent: "flex-end",
        },
    }),
);

export default function Navigation() {
    const styles = useStyles();

    return (
        <>
            <AppBar position="relative">
                <Container maxWidth="md">
                    <Toolbar className={styles.toolbar}>
                        <Box>
                            <ConnectedClients names={["Foo", "Bar"]} />
                        </Box>
                        <Box>
                            <Auth />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}
