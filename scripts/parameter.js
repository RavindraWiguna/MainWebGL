// Center of Object
const CX = 0.0;
const CY = 1.5;
const CZ = 0.0;
// general parameter
const SIDE = 72;
// Top ring parameters
const HEIGHT_TOP_RING = 0.1
const R_TOP_RING = 1;
const WIDTH_TOP_RING = 0.1;
const R_OUTER_TOP_RING = R_TOP_RING+WIDTH_TOP_RING;
// Bridge ring to body parameters
const HEIGHT_BRIDGE = 0.4;
const WIDTH_BRIDGE = 0.15;
const R_OUTER_BRIDGE = R_OUTER_TOP_RING+WIDTH_BRIDGE;
const CY_BRIDGE = CY-HEIGHT_TOP_RING;
// Body parameters
const HEIGHT_BODY = 4;
const CY_BOTTOM_BODY = CY_BRIDGE-HEIGHT_BODY;