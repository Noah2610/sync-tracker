import { ListItem, ListItemProps } from "@material-ui/core";
import { Pattern } from "../../../../store/types";

export type PatternListItemProps = {
    pattern: Pick<Pattern, "name">;
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
