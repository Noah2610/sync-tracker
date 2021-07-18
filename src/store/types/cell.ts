import LibNote from "../../../lib/track/note";

export type CellPos =
    | `${CellPosBar}:${CellPosQuarter}`
    | `${CellPosBar}:${CellPosQuarter}:${CellPosSixteenth}`;
export type CellPosBar = number;
export type CellPosQuarter = number;
export type CellPosSixteenth = number;

export type CellId = CellPos;

// export type Cells = Record<CellId, Cell>;
export type Cells = Record<string, Cell>;

export type Cell = { id: CellId } & (CellNote | CellCommand);

export type CellPart = CellNote | Effect | CellCommand;

export interface CellNote {
    type: "note";
    note: LibNote;
    effects?: Record<EffectType, Effect>;
}

export interface CellCommand {
    type: "command";
    command: "cut" | "skip";
}

export type EffectType = Effect["type"];

export type Effect =
    | {
          type: "volume";
          volume: number;
      }
    | {
          type: "volumeSlide";
          slide: ["up" | "down", number];
      }
    | {
          type: "vibrato";
          speed: number;
          depth: number;
      }
    | {
          type: "effectReset";
          effectType: Omit<EffectType, "effectReset">;
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
