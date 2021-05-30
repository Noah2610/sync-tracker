import LibTrack from "../../../lib/track";

export interface Track {
    name: string;
    config: LibTrack["config"];
    patternArrangement: LibTrack["patternArrangement"];
}

export type TrackId = string;
