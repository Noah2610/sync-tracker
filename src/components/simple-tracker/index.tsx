import { Box } from "@material-ui/core";
import useSelectedTrack from "../../hooks/use-selected-track";
import useSelectedPattern from "../../hooks/use-selected-pattern";
import BeatDisplay from "./beat-display";
import PatternSelect from "../tracker/pattern-select";

export default function SimpleTracker() {
    return (
        <Box>
            <Box>
                <PatternSelect />
            </Box>
            <Box>
                <SimpleTrackerGrid />
            </Box>
        </Box>
    );
}

function SimpleTrackerGrid() {
    const [trackId, track] = useSelectedTrack();
    const [patternId, pattern] = useSelectedPattern();

    if (
        trackId === undefined ||
        track === undefined ||
        patternId === undefined ||
        pattern === undefined
    ) {
        return null;
    }

    const patternLen = track.config.patternLen;

    // const channels = pattern.channels;

    console.log(track, pattern);

    return (
        <>
            {Array.from({ length: patternLen }).map((_, beat) => (
                <Box key={beat}>
                    <BeatDisplay beat={beat} />
                </Box>
            ))}
        </>
    );
}
