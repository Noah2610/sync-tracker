import {
    createStyles,
    makeStyles,
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogProps,
    DialogTitle,
    FormControl,
    FormHelperText,
    TextField,
} from "@material-ui/core";
import { useState, FormEvent } from "react";
import { useWs } from "../ws/ws-context";
import ClientName from "./client-name";
import Loading from "./loading";

export type ClientNameDialogProps = {} & DialogProps;

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
    }),
);

export default function ClientNameDialog(props: ClientNameDialogProps) {
    const MAX_NAME_LENGTH = 20;

    const ws = useWs();
    const styles = useStyles();
    const [name, setNameState] = useState(ws?.client?.name || "");
    const [error, setError] = useState("");

    const setName = (input: string): void =>
        setNameState(
            input
                .replace(/^\s+/, "") // Remove leading whitespace
                .replace(/\s{2,}/g, " ") // Squeeze all duplice whitespace
                .replace(/(^|\s)\w/g, (w) => w.toUpperCase()) // Capitalize words
                .slice(0, MAX_NAME_LENGTH), // Truncate full name to max length
        );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name || !!name.match(/^\s*$/)) {
            setError("Name cannot be empty.");
        } else {
            setError("");
            ws?.sendMessage({
                kind: "UpdateClientName",
                name,
            });
        }
    };

    return (
        <Dialog {...props}>
            <DialogTitle>Change Your Name</DialogTitle>
            <DialogContent>
                <Container className={styles.container}>
                    {ws && ws.client ? (
                        <>
                            <Box marginBottom={2}>
                                <ClientName client={ws.client} />
                            </Box>
                            <form action="#" onSubmit={handleSubmit}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    marginBottom={2}
                                >
                                    <FormControl margin="dense">
                                        <FormHelperText error>
                                            {error}
                                        </FormHelperText>
                                        <TextField
                                            autoFocus
                                            value={name}
                                            placeholder="New client name..."
                                            variant="outlined"
                                            onChange={(event) =>
                                                setName(
                                                    event.currentTarget.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl margin="dense">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                        >
                                            Update Name
                                        </Button>
                                    </FormControl>
                                </Box>
                            </form>
                        </>
                    ) : (
                        <Loading />
                    )}
                </Container>
            </DialogContent>
        </Dialog>
    );
}
