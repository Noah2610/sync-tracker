import { memo } from "react";
import { HeadTableCell, HeadTableRow, TableCell, TableHead } from "./styles";

export interface GridTableHeadProps {
    patternLen: number;
    cellClassName?: string;
}

export default memo(function GridTableHead({
    patternLen,
    cellClassName,
}: GridTableHeadProps) {
    return (
        <TableHead>
            <HeadTableRow>
                <TableCell component="td" />
                {Array.from({ length: patternLen }, (_, step) => (
                    <HeadTableCell
                        key={step}
                        className={cellClassName}
                        component="th"
                    >
                        {step + 1}
                    </HeadTableCell>
                ))}
            </HeadTableRow>
        </TableHead>
    );
});
