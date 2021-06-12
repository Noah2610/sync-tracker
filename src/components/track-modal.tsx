import { useEffect, useState } from "react";
import produce from "immer";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    TextField,
} from "@material-ui/core";
import RecursivePartial from "../../lib/util/recursive-partial";
import { Track } from "../store/types";

export interface TrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    track?: Track;
    onSubmit?: (track: Track) => void;
    onChange?: (trackPart: RecursivePartial<Track>) => void;
}

// type ErrorsFor<T extends Record<string, any>> = {
//     [K in keyof T]: T[K] extends Array<any>
//         ? string | undefined
//         : T[K] extends Record<string, any>
//         ? ErrorsFor<T[K]>
//         : string | undefined;
// };

// type TrackErrors = ErrorsFor<Track>;

interface TrackErrors {
    name: string | undefined;
    "config.bpm": string | undefined;
    "config.patternLen": string | undefined;
    "config.barLen": string | undefined;
}

export default function TrackModal({
    isOpen,
    onClose,
    track,
    onSubmit,
    onChange,
}: TrackModalProps) {
    const [trackPart, setTrackPart] = useState<RecursivePartial<Track>>(
        track || {},
    );

    const errors: TrackErrors = {
        name: !trackPart.name ? "Name must be given" : undefined,
        "config.bpm":
            trackPart.config?.bpm === undefined
                ? "BPM number must be given"
                : undefined,
        "config.patternLen":
            trackPart.config?.patternLen === undefined
                ? "Pattern length number must be given"
                : undefined,
        "config.barLen":
            trackPart.config?.barLen === undefined
                ? "Bar length number must be given"
                : undefined,
    };

    const isValid = Object.values(errors).every((err) => !err);

    const handleSubmit =
        onSubmit && isValid ? () => onSubmit(trackPart as Track) : undefined;

    const handleChange = onChange ? () => onChange(trackPart) : () => {};

    useEffect(handleChange, [trackPart, handleChange]);

    const title = track ? `Edit Track ${track.name}` : "New Track";
    const submitText = track ? "Save" : "Create";

    const updateName = (name: string) =>
        setTrackPart((baseState) =>
            produce(baseState, (state) => {
                state.name = name;
            }),
        );

    const updateConfigValue = (
        field: keyof Track["config"],
        valueStr: string,
    ) => {
        const valueNum = parseInt(valueStr);
        if (!Number.isNaN(valueNum)) {
            setTrackPart((baseState) =>
                produce(baseState, (state) => {
                    if (!state.config) {
                        state.config = {};
                    }
                    state.config[field] = valueNum;
                }),
            );
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" gridGap="16px">
                    <FormControl>
                        <TextField
                            label="Name"
                            value={trackPart.name}
                            onChange={(e) => updateName(e.target.value)}
                        />
                        <FormHelperText>Your track's name.</FormHelperText>
                        {errors.name && (
                            <FormHelperText error>{errors.name}</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl>
                        <TextField
                            label="BPM"
                            type="number"
                            value={trackPart.config?.bpm}
                            onChange={(e) =>
                                updateConfigValue("bpm", e.target.value)
                            }
                        />
                        <FormHelperText>
                            Your track's Beats-Per-Minute.
                        </FormHelperText>
                        {errors["config.bpm"] && (
                            <FormHelperText error>
                                {errors["config.bpm"]}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl>
                        <TextField
                            label="Pattern Length"
                            type="number"
                            value={trackPart.config?.patternLen}
                            onChange={(e) =>
                                updateConfigValue("patternLen", e.target.value)
                            }
                        />
                        <FormHelperText>
                            Number of beats in each pattern.
                        </FormHelperText>
                        {errors["config.patternLen"] && (
                            <FormHelperText error>
                                {errors["config.patternLen"]}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl>
                        <TextField
                            label="Bar Length"
                            type="number"
                            value={trackPart.config?.barLen}
                            onChange={(e) =>
                                updateConfigValue("barLen", e.target.value)
                            }
                        />
                        <FormHelperText>
                            Number of beats in a bar.
                        </FormHelperText>
                        {errors["config.barLen"] && (
                            <FormHelperText error>
                                {errors["config.barLen"]}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button variant="contained" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    {submitText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
