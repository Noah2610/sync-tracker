import { Box } from "@material-ui/core";
import useSelectedTrack from "../../hooks/use-selected-track";
import useSelectedPattern from "../../hooks/use-selected-pattern";
import BeatDisplay from "./beat-display";
import PatternSelect from "../tracker/pattern-select";

export default function SimpleTracker() {
    const [trackId, track] = useSelectedTrack();
    const [patternId, pattern] = useSelectedPattern();

    if (
        trackId === undefined ||
        track === undefined // ||
        // patternId === undefined ||
        // pattern === undefined
    ) {
        return null;
    }

    const patternLen = track.config.patternLen;

    // const channels = pattern.channels;

    return (
        <Box>
            <PatternSelect />
            <Box>
                {Array.from({ length: patternLen }).map((_, beat) => (
                    <>
                        <BeatDisplay beat={beat} />
                    </>
                ))}
            </Box>
        </Box>
    );
}
