import { createStyles, makeStyles, TableCellProps } from "@material-ui/core";
import { memo } from "react";
import { BeatTableCell } from "./styles";

export type BeatCellProps = {
    isActive: boolean;
    toggle: () => void;
} & TableCellProps;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            backgroundColor: ({ isActive }: { isActive: boolean }) =>
                isActive ? theme.tracker.colors.cells.active.main : "inherit",
        },
    }),
);

export default memo(
    function BeatCell({ isActive, toggle, ...props }: BeatCellProps) {
        const styles = useStyles({ isActive });
        const className = `${styles.root} ${props.className || ""}`;
        return (
            <BeatTableCell {...props} className={className} onClick={toggle} />
        );
    },
    (prev, next) => prev.isActive === next.isActive,
);
