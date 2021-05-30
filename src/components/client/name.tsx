import { useMemo } from "react";
import {
    createStyles,
    makeStyles,
    Avatar,
    Box,
    Tooltip,
    Typography,
} from "@material-ui/core";

export interface ClientNameProps {
    avatarSrc?: string;
    name: string;
    size?: "normal" | "small";
}

const useStyles = makeStyles((_theme) =>
    createStyles({
        wrapper: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
        },
        name: {
            display: "block",
            fontSize: 14,
            letterSpacing: 2,
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: 1.2,
            paddingTop: 4,
            width: "inherit",
        },
    }),
);

const useNameStyles = makeStyles({
    normal: {
        fontSize: 14,
        letterSpacing: 2,
    },
    small: {
        fontSize: 10,
        letterSpacing: 0,
    },
});

const useAvatarStyles = makeStyles({
    normal: {
        fontSize: 18,
        width: 40,
        height: 40,
    },
    small: {
        fontSize: 10,
        width: 20,
        height: 20,
    },
});

export default function ClientName({
    avatarSrc,
    name,
    size = "normal",
}: ClientNameProps) {
    const styles = useStyles();
    const nameStyles = useNameStyles();
    const avatarStyles = useAvatarStyles();

    let width = 128;
    switch (size) {
        case "normal": {
            width = 128;
            break;
        }
        case "small": {
            width = 48;
            break;
        }
    }

    const avatarLetters = useMemo(
        () =>
            avatarSrc
                ? null
                : name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2),
        [name, avatarSrc],
    );

    return (
        <>
            <Tooltip
                title={<Typography className={styles.name}>{name}</Typography>}
            >
                <Box className={styles.wrapper} width={width}>
                    <Avatar
                        className={avatarStyles[size]}
                        src={avatarSrc}
                        alt={name}
                    >
                        {avatarLetters}
                    </Avatar>
                    <Typography
                        className={`${styles.name} ${nameStyles[size]}`}
                        noWrap
                    >
                        {name}
                    </Typography>
                </Box>
            </Tooltip>
        </>
    );
}
