import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocPattern, DocTrack, DocChannel, DocCell } from "../firebase/types";
import {
    Track,
    Tracks,
    TrackId,
    Pattern,
    Patterns,
    PatternId,
    ChannelId,
    Channels,
    Channel,
    CellId,
} from "./types";

export interface TrackStore {
    tracks: Tracks;
    selectedTrack?: {
        id: TrackId;
        selectedPattern?: {
            id: PatternId;
        };
    };
}

const initialState: TrackStore = {
    tracks: {},
};

const trackSlice = createSlice({
    name: "track",
    initialState,
    reducers: {
        selectTrack(state, { payload }: PayloadAction<TrackId>) {
            if (state.selectedTrack?.id !== payload) {
                state.selectedTrack = {
                    id: payload,
                };
            }
            state.selectedTrack.id = payload;
        },

        selectPattern(state, { payload }: PayloadAction<PatternId>) {
            if (!state.selectedTrack) {
                console.error(
                    `[selectPattern] Can't select pattern when no track is selected`,
                );
                return;
            }
            if (state.selectedTrack.selectedPattern?.id !== payload) {
                state.selectedTrack.selectedPattern = {
                    id: payload,
                };
            }
            state.selectedTrack.selectedPattern.id = payload;
        },

        setStateTracks(state, { payload }: PayloadAction<DocTrack[]>) {
            const newTracks: Tracks = {};
            for (const track of Object.values(payload)) {
                newTracks[track.id] = {
                    patterns:
                        (state.tracks[track.id]?.patterns as
                            | Patterns
                            | undefined) || {},
                    ...track,
                };
            }
            state.tracks = newTracks;
        },

        setStatePatterns(
            state,
            {
                payload: { trackId, patterns },
            }: PayloadAction<{ trackId: TrackId; patterns: DocPattern[] }>,
        ) {
            const track = expectTrack(state.tracks as Tracks, trackId);
            const newPatterns: Patterns = {};
            for (const pattern of patterns) {
                newPatterns[pattern.id] = {
                    channels: track.patterns[pattern.id]?.channels || {},
                    ...pattern,
                };
            }
            track.patterns = newPatterns;
        },

        setStateChannels(
            state,
            {
                payload: { trackId, patternId, channels },
            }: PayloadAction<{
                trackId: TrackId;
                patternId: PatternId;
                channels: DocChannel[];
            }>,
        ) {
            const track = expectTrack(state.tracks as Tracks, trackId);
            const pattern = expectPattern(
                track.patterns as Patterns,
                patternId,
            );
            const newChannels: Channels = {};
            for (const channel of channels) {
                newChannels[channel.id] = {
                    cells: pattern.channels[channel.id]?.cells || {},
                    ...channel,
                };
            }
            pattern.channels = newChannels;
        },

        setStateCells(
            state,
            {
                payload: { trackId, patternId, channelId, cells },
            }: PayloadAction<{
                trackId: TrackId;
                patternId: PatternId;
                channelId: ChannelId;
                cells: DocCell[];
            }>,
        ) {
            const track = expectTrack(state.tracks as Tracks, trackId);
            const pattern = expectPattern(
                track.patterns as Patterns,
                patternId,
            );
            const channel = expectChannel(pattern.channels, channelId);
            channel.cells = {};
            for (const cell of cells) {
                channel.cells[cell.id] = cell;
            }
        },

        // setPatterns(
        //     state,
        //     { payload }: PayloadAction<Record<PatternId, DocPattern>>,
        // ) {
        //     for (const patternId in payload) {
        //         state.patterns[patternId] = {
        //             ...payload[patternId]!,
        //             notes: state.patterns[patternId]?.notes || {},
        //         };
        //     }

        //     if (state.selectedTrackId && !state.selectedPatternId) {
        //         const firstPattern = Object.keys(state.patterns).reduce<
        //             [PatternId, Pattern] | undefined
        //         >(
        //             (acc, patternId) =>
        //                 acc === undefined ||
        //                 state.patterns[patternId]!.order < acc[1].order
        //                     ? [patternId, state.patterns[patternId]! as Pattern]
        //                     : acc,
        //             undefined,
        //         );
        //         if (firstPattern) {
        //             state.selectedPatternId = firstPattern[0];
        //         }
        //     }
        // },

        // setPatternNotes(
        //     state,
        //     {
        //         payload: { patternId, notes },
        //     }: PayloadAction<{
        //         patternId: PatternId;
        //         notes: Record<NoteId, DocNote>;
        //     }>,
        // ) {
        //     const pattern = state.patterns[patternId];
        //     if (pattern) {
        //         let noteId: NoteId;
        //         for (noteId in notes) {
        //             pattern.notes[noteId] = {
        //                 ...notes[noteId]!,
        //                 beats: pattern.notes[noteId]?.beats || {},
        //             };
        //         }
        //     } else {
        //         console.error(
        //             `Can't set notes for pattern ${patternId} because pattern doesn't exist`,
        //         );
        //     }
        // },

        // updatePatternNotes(
        //     state,
        //     {
        //         payload: { patternId, notes },
        //     }: PayloadAction<{
        //         patternId: PatternId;
        //         notes: { [note in NoteId]?: DocNote | null };
        //     }>,
        // ) {
        //     const pattern = state.patterns[patternId];
        //     if (pattern) {
        //         let noteId: NoteId;
        //         for (noteId in notes) {
        //             const note = notes[noteId];
        //             if (note) {
        //                 pattern.notes[noteId] = {
        //                     ...note,
        //                     beats: pattern.notes[noteId]?.beats || {},
        //                 };
        //             } else {
        //                 delete pattern.notes[noteId];
        //             }
        //         }
        //     } else {
        //         console.error(
        //             `Can't update notes for pattern ${patternId} because pattern doesn't exist`,
        //         );
        //     }
        // },

        // updatePatternBeats(
        //     state,
        //     {
        //         payload: { patternId, noteId, beats },
        //     }: PayloadAction<{
        //         patternId: PatternId;
        //         noteId: NoteId;
        //         beats: Record<BeatId, DocBeat | null>;
        //     }>,
        // ) {
        //     const pattern = state.patterns[patternId];
        //     if (pattern) {
        //         const note = pattern.notes[noteId];
        //         if (note) {
        //             for (const beatIdS in beats) {
        //                 const beatId = parseInt(beatIdS) ?? -1;
        //                 const beat = beats[beatId];
        //                 if (beat) {
        //                     note.beats[beatId] = beat;
        //                 } else {
        //                     if (note.beats[beatId]) {
        //                         delete note.beats[beatId];
        //                     }
        //                 }
        //             }
        //         } else {
        //             console.error(
        //                 `Can't update beats for note ${noteId} in pattern ${patternId} because note doesn't exist`,
        //             );
        //         }
        //     } else {
        //         console.error(
        //             `Can't update beats for pattern ${patternId} because pattern doesn't exist`,
        //         );
        //     }
        // },
    },
});

function expectTrack(tracks: Tracks, trackId: TrackId): Track {
    const track = tracks[trackId];
    if (!track) {
        throw new Error(`[expectTrack] Track with id ${trackId} doesn't exist`);
    }
    return track;
}

function expectPattern(patterns: Patterns, patternId: PatternId): Pattern {
    const pattern = patterns[patternId];
    if (!pattern) {
        throw new Error(
            `[expectPattern] Pattern with id ${patternId} doesn't exist`,
        );
    }
    return pattern;
}

function expectChannel(channels: Channels, channelId: ChannelId): Channel {
    const channel = channels[channelId];
    if (!channel) {
        throw new Error(
            `[expectChannel] Channel with id ${channelId} doesn't exist`,
        );
    }
    return channel;
}

export const actions = trackSlice.actions;

export default trackSlice;
