import { useState } from "react";
import { BeatTableCell } from "./styles";

export interface BeatCellProps {}

export default function BeatCell({}: BeatCellProps) {
    const [isActive, setActive] = useState(false);
    const toggleActive = () => setActive((prev) => !prev);

    return <BeatTableCell active={isActive} onClick={toggleActive} />;
}
