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
import TrackSelect from "../track-select";

const useStyles = makeStyles((_theme) =>
    createStyles({
        toolbar: {
            justifyContent: "space-between",
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
                            <TrackSelect />
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <ConnectedClients names={["Foo", "Bar"]} />
                            <Auth />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}
