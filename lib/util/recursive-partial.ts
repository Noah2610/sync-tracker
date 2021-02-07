/**
 * Taken from Tone.js, which itself was taken from here:
 * https://stackoverflow.com/a/51365037
 */
type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<RecursivePartial<U>>
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};

export default RecursivePartial;
