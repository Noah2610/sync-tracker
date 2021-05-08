import { Box, Button, TextField } from "@material-ui/core";
import { useSelector, useDispatch } from "../store";
import { actions as counterActions } from "../store/counter";

export default function Counter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <Box
            maxWidth={360}
            mx="auto"
            display="flex"
            flexDirection="column"
            gridGap={32}
        >
            <Box>
                Count: <strong>{count}</strong>
            </Box>

            <Box display="flex" gridGap={32}>
                <Button onClick={() => dispatch(counterActions.add(1))}>
                    Increment
                </Button>
                <Button onClick={() => dispatch(counterActions.sub(1))}>
                    Decrement
                </Button>
                <TextField
                    type="number"
                    name="value"
                    onChange={(e) => {
                        const value = parseInt(e.currentTarget.value);
                        if (value || value === 0) {
                            dispatch(counterActions.set(value));
                        }
                    }}
                />
            </Box>
        </Box>
    );
}
