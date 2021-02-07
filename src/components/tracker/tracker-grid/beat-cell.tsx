import { createStyles, makeStyles } from "@material-ui/core";
import { BeatTableCell } from "./styles";

export interface BeatCellProps {
    isActive: boolean;
    toggle: () => void;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            backgroundColor: ({ isActive }: { isActive: boolean }) =>
                isActive ? theme.tracker.colors.cells.active.main : "inherit",
        },
    }),
);

export default function BeatCell({ isActive, toggle }: BeatCellProps) {
    const styles = useStyles({ isActive });
    return <BeatTableCell className={styles.root} onClick={toggle} />;
}
