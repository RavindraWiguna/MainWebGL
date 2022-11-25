// Center of Object
const CX = 0.0;
const CY = 1.5;
const CZ = 0.0;
// general parameter
const SIDE = 72;
// Can opener parameters
const SIDE_CANOP=6;
const HEIGHT_CANOP = 0.05;
const R_CANOP = 0.2;
const WIDTH_CANOP = 0.1;
const R_OUTER_CANOP = R_CANOP+WIDTH_CANOP;
const CX_CANOP = CX-R_OUTER_CANOP/2;
const CZ_CANOP = CZ-R_OUTER_CANOP/2;
const COLOR_CANOP = [0.762, 0.755, 0.734];
// Top ring parameters
const HEIGHT_TOP_RING = 0.1
const R_TOP_RING = 1;
const WIDTH_TOP_RING = 0.1;
const R_OUTER_TOP_RING = R_TOP_RING+WIDTH_TOP_RING;
const COLOR_TOP_RING = [0.56, 0.57, 0.58];
// Bridge ring to body parameters
const HEIGHT_BRIDGE = 0.4;
const WIDTH_BRIDGE = 0.15;
const R_OUTER_BRIDGE = R_OUTER_TOP_RING+WIDTH_BRIDGE;
const CY_BRIDGE = CY-HEIGHT_TOP_RING;
const COLOR_BRIDGE_1 = [0.650, 0.656, 0.654];
const COLOR_BRIDGE_2 = [0.972, 0.960, 0.915];
// Body parameters
const HEIGHT_BODY = 4;
const CY_BOTTOM_BODY = CY_BRIDGE-HEIGHT_BODY;