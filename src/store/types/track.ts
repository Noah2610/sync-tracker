import LibTrack from "../../../lib/track";
import { Patterns } from "./pattern";

export type Tracks = Record<TrackId, Track>;

export interface Track {
    name: string;
    config: LibTrack["config"];
    patterns: Patterns;
    patternArrangement: LibTrack["patternArrangement"];
}

export type TrackId = string;
