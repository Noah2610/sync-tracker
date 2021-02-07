import { ListItem, ListItemProps } from "@material-ui/core";
import Pattern, { PatternId } from "../../../../lib/track/pattern";

export type PatternListItemProps = {
    pattern: Pattern;
    isSelected: boolean;
} & ListItemProps<"div">;

export default function PatternListItem({
    pattern,
    isSelected,
    ...props
}: PatternListItemProps) {
    return (
        <ListItem {...props} button selected={isSelected}>
            {pattern.name}
        </ListItem>
    );
}
