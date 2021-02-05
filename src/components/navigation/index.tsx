import {
    createStyles,
    makeStyles,
    AppBar,
    Box,
    Button,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { useWs } from "../../ws/ws-context";

const useStyles = makeStyles((theme) =>
    createStyles({
        toolbar: {
            justifyContent: "flex-end",
        },
        nameLabel: {
            display: "block",
            fontSize: 12,
            textDecoration: "underline",
            textAlign: "right",
        },
        name: {
            display: "block",
            fontSize: 14,
            letterSpacing: 2,
            textAlign: "right",
            fontWeight: "bold",
        },
    }),
);

export default function Navigation() {
    const ws = useWs();
    const styles = useStyles();

    return (
        <AppBar position="relative">
            <Toolbar className={styles.toolbar}>
                <Button variant="text">
                    <Box>
                        <Typography className={styles.nameLabel}>
                            Name
                        </Typography>
                        <Typography className={styles.name}>
                            {ws?.client?.name || "..."}
                        </Typography>
                    </Box>
                </Button>
            </Toolbar>
        </AppBar>
    );
}
