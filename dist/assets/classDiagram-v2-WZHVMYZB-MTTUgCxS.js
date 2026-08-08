import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-D3BH3soz.js";
import { _ as __name } from "./mermaid.core-D_KjrEEi.js";
import "./chunk-FMBD7UC4-B3e46Yu4.js";
import "./chunk-55IACEB6-BMkU8AR8.js";
import "./chunk-QN33PNHL-DEptAW7c.js";
import "./index-CzBqXVsM.js";
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
