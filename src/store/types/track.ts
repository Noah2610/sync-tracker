import LibTrack from "../../../lib/track";

export type Tracks = Record<TrackId, Track>;

export interface Track {
    name: string;
    config: LibTrack["config"];
    patternArrangement: LibTrack["patternArrangement"];
}

export type TrackId = string;
