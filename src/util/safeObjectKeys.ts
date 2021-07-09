export type SafeObjectKeys = <T extends object>(obj: T) => (keyof T)[];

const safeObjectKeys: SafeObjectKeys = Object.keys;

export default safeObjectKeys;
