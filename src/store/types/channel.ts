import LibPattern from "../../../lib/track/pattern";
import { Cells } from "./cell";

export type ChannelId = string;

export type Channels = Record<ChannelId, Channel>;

export interface Channel {
    id: ChannelId;
    name: string;
    instrument: Instrument;
    cells: Cells;
    // defaultAdsr: undefined; // TODO
}

export type Instrument = LibPattern["instrument"];
