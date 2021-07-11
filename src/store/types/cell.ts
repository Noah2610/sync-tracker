import LibNote from "../../../lib/track/note";

export type CellPos =
    | `${CellPosBar}:${CellPosQuarter}`
    | `${CellPosBar}:${CellPosQuarter}:${CellPosSixteenth}`;
export type CellPosBar = number;
export type CellPosQuarter = number;
export type CellPosSixteenth = number;

export type Cells = Record<CellPos, CellGroup>;

export type CellGroup = Cell[];

export type Cell = CellAttack | CellRelease | CellEffect | CellCommand;

export interface CellAttack {
    type: "attack";
    note: LibNote;
    attack?: NoteAttack;
}

export interface CellRelease {
    type: "release";
    release?: NoteRelease;
}

export interface CellEffect {
    type: "effect";
    effect: Effect;
}

export interface CellCommand {
    tpye: "command";
    command: "cutCommand" | "nextPattern";
}

export type NoteAttack = number;
export type NoteRelease = number;

export type Effect =
    | {
          type: "volume";
          payload: {
              volume: number;
          } | null;
      }
    | {
          type: "volumeSlide";
          payload: {
              slide: ["up" | "down", number];
          } | null;
      }
    | {
          type: "vibrato";
          payload: {
              speed: number;
              depth: number;
          } | null;
      };

export function splitCellPos(
    pos: CellPos,
): [CellPosBar, CellPosQuarter, CellPosSixteenth | undefined] {
    const [bar, quarter, sixteenth] = pos.split(":").map(parseInt);
    const isValidNum = (num: number | undefined): num is number =>
        num !== undefined && !Number.isNaN(num);
    if (!isValidNum(bar) || !isValidNum(quarter)) {
        throw new Error(`[splitCellPos] Invalid CellPos string: ${pos}`);
    }
    return [bar, quarter, isValidNum(sixteenth) ? sixteenth : undefined];
}
