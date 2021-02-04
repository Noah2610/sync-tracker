import { startWs } from "./src";
import { createState } from "./src/state";

const state = createState();

startWs(state);
