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
const CX_CANOP = CX-R_OUTER_CANOP/2-0.05;
const CZ_CANOP = CZ-R_OUTER_CANOP/2+0.05;
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
// Bridge parameters
const HEIGHT_BRIDGE_2 = HEIGHT_BRIDGE/2;
// Bottom ring parameters
const CY_BOTTOM_RING = CY_BOTTOM_BODY - HEIGHT_BRIDGE_2;

// camera param
let fov = toRadian(45);
let near = 0.1;
let far = 1000;
let camx = 3.0,camy=4.0,camz=8.0;
let camPos = [camx, camy, camz];
let targetx = 0.0, targety = 0.0, targetz = 0.0;
let target = [targetx, targety, targetz];
let upx = 0.0, upy = 1.0, upz = 0.0;
let up = [upx, upy, upz];