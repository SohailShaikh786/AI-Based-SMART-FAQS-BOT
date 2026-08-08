import { s as styles_default, b as stateRenderer_v3_unified_default, a as stateDiagram_default, S as StateDB } from "./chunk-DI55MBZ5-D3KsgDQY.js";
import { _ as __name } from "./mermaid.core-D_KjrEEi.js";
import "./chunk-55IACEB6-BMkU8AR8.js";
import "./chunk-QN33PNHL-DEptAW7c.js";
import "./index-CzBqXVsM.js";
var diagram = {
  parser: stateDiagram_default,
  get db() {
    return new StateDB(2);
  },
  renderer: stateRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
