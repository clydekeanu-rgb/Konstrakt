// ConsCalc engine — calculation constants ported from the standalone calculator.
export const BAR_LENGTH_M = 6;
export const TIE_WIRE_INTERSECTIONS_PER_KG = 53;

export const CHB_AREA_PER_PIECE = 0.0924;
export const CHB_4_MORTAR_CEMENT = 0.525;
export const CHB_6_MORTAR_CEMENT = 1.013;
export const CHB_4_MORTAR_SAND = 0.0438;
export const CHB_6_MORTAR_SAND = 0.085;

export const WALL_VERT_BAR_LM = { 40: 2.93, 60: 2.13, 80: 1.6 };
export const WALL_HORIZ_BAR_LM = { 2: 3.3, 3: 2.15, 4: 1.72 };
export const WALL_TIE_WIRE_PER_INTERSECTION = 0.3;
export const WALL_PLASTER_CEMENT = 0.288;
export const WALL_PLASTER_SAND = 0.16;

export const STEEL_KG_PER_PC = {
  "10mm": 3.702,
  "12mm": 5.328,
  "16mm": 9.468,
  "20mm": 14.796,
};

export const mixClasses = {
  AA: { ratio: "1:1.5:3", cement: 12, sand: 0.5, gravel: 1 },
  A: { ratio: "1:2:4", cement: 9, sand: 0.5, gravel: 1 },
  B: { ratio: "1:2.5:5", cement: 7.5, sand: 0.5, gravel: 1 },
  C: { ratio: "1:3:6", cement: 6, sand: 0.5, gravel: 1 },
};

export const tileRates = {
  "7.5x7.5 cm": 177.8,
  "10x10 cm": 100,
  "10.6x10.6 cm": 88.4,
  "10x20 cm": 50,
  "15x15 cm": 44.4,
  "15x20 cm": 33.3,
  "15x30 cm": 22.2,
  "20x20 cm": 25,
  "20x30 cm": 16.7,
  "20x40 cm": 12.5,
  "25x25 cm": 16,
  "30x30 cm": 11.1,
  "30x60 cm": 5.6,
  "40x40 cm": 6.25,
  "50x50 cm": 4,
  "20x120 cm": 4.17,
};

export const woodPaintCoverage = {
  "Quick Dry Enamel": 30,
  "Flat Wall Enamel": 40,
  "Varnish / Spar": 40,
  Lacquer: 35,
};

export const scaffoldingFactors = {
  "2x2": { vert: 4.7, horiz: 21, brace: 11.7, w1: 2, w2: 2 },
  "2x3": { vert: 7, horiz: 31.7, brace: 17.5, w1: 2, w2: 3 },
  "2x4": { vert: 9.35, horiz: 42.3, brace: 23.4, w1: 2, w2: 4 },
};

export const suspendedSlabRates = {
  oneWay: {
    10: { c: 3.764, ties: 0.474 },
    12.5: { c: 3.062, ties: 0.316 },
    15: { c: 2.584, ties: 0.228 },
    17.5: { c: 2.232, ties: 0.168 },
    20: { c: 1.98, ties: 0.132 },
    22.2: { c: 1.786, ties: 0.11 },
    25: { c: 1.627, ties: 0.089 },
  },
  twoWay: {
    10: { c: 4.369, ties: 0.592 },
    12.5: { c: 3.603, ties: 0.416 },
    15: { c: 3.221, ties: 0.35 },
    17.5: { c: 2.647, ties: 0.247 },
    20: { c: 2.36, ties: 0.174 },
    22.2: { c: 2.168, ties: 0.168 },
    25: { c: 1.977, ties: 0.142 },
  },
};

export const OPENING_TYPES = [
  "Main Door",
  "Balcony Door",
  "CR/Toilet Door",
  "Bedroom Door",
  "Window",
];

export const modules = [
  { id: "wall", label: "Wall", groupLabel: "Walls" },
  { id: "footing", label: "Footing", groupLabel: "Footings" },
  { id: "column", label: "Column", groupLabel: "Columns" },
  { id: "beam", label: "Beam", groupLabel: "Beams" },
  { id: "slab", label: "Slab on Fill", groupLabel: "Slabs" },
  { id: "suspendedOneWay", label: "Suspended Slab — One Way", groupLabel: "Suspended slabs" },
  { id: "suspendedTwoWay", label: "Suspended Slab — Two Way", groupLabel: "Suspended slabs" },
  { id: "tiling", label: "Tiling", groupLabel: "Tiling" },
  { id: "paintConcrete", label: "Paint Concrete", groupLabel: "Paint" },
  { id: "paintWood", label: "Paint Wood", groupLabel: "Paint" },
  { id: "ceiling", label: "Ceiling", groupLabel: "Ceilings" },
  { id: "drywall", label: "Drywall Partition", groupLabel: "Drywall" },
  { id: "roofing", label: "Roofing", groupLabel: "Roofing" },
  { id: "scaffolding", label: "Scaffolding", groupLabel: "Scaffolding" },
  { id: "riprap", label: "Riprapping", groupLabel: "Riprapping" },
  { id: "stairs", label: "Concrete Stairs", groupLabel: "Stairs" },
];

export const requiredFields = {
  wall: ["length", "height"],
  footing: ["width", "length", "thickness"],
  column: ["height", "w1", "w2"],
  beam: ["length", "b", "d"],
  slab: ["length", "width", "thickness"],
  suspendedOneWay: ["length", "width", "thickness"],
  suspendedTwoWay: ["length", "width", "thickness"],
  tiling: ["area"],
  paintConcrete: ["area"],
  paintWood: ["area"],
  ceiling: ["length", "width"],
  drywall: ["area"],
  roofing: ["span", "width"],
  scaffolding: ["floorArea"],
  riprap: ["length", "height"],
  stairs: ["steps", "width"],
};

export const defaults = {
  wall: {
    length: 6,
    height: 3,
    chb: "4",
    vSpacing: "60",
    hLayers: "2",
    vDiameter: "10mm",
    hDiameter: "10mm",
    plaster: true,
    faces: "2",
    openings: [],
  },
  footing: {
    width: 1,
    length: 1,
    thickness: 0.3,
    count: 1,
    barsL: 5,
    barsW: 5,
    cover: 0.05,
    barDiameter: "16mm",
    mix: "A",
  },
  column: {
    height: 3,
    w1: 0.3,
    w2: 0.3,
    count: 4,
    verticalBars: 4,
    barDiameter: "16mm",
    stirrupDiameter: "10mm",
    stirrupSpacing: 0.2,
    mix: "A",
  },
  beam: {
    length: 6,
    b: 0.25,
    d: 0.4,
    count: 2,
    topBars: 2,
    topDiameter: "16mm",
    bottomBars: 2,
    bottomDiameter: "16mm",
    webBars: 2,
    webDiameter: "16mm",
    stirrupDiameter: "10mm",
    stirrupSpacing: 0.2,
    mix: "A",
  },
  slab: {
    length: 6,
    width: 4,
    thickness: 0.1,
    spacingL: 0.2,
    diaL: "16mm",
    spacingW: 0.2,
    diaW: "16mm",
    mix: "A",
  },
  suspendedOneWay: { length: 6, width: 4, thickness: 0.12, spacing: "15", barDiameter: "10mm", mix: "A" },
  suspendedTwoWay: { length: 6, width: 4, thickness: 0.12, spacing: "15", barDiameter: "10mm", mix: "A" },
  tiling: { area: 20, tileSize: "30x30 cm", breakage: 10 },
  paintConcrete: { area: 50, surface: "Exterior", coverage: 30, coats: 2 },
  paintWood: { area: 20, type: "Quick Dry Enamel", coverage: 30, coats: 2 },
  ceiling: { length: 5, width: 4 },
  drywall: { area: 24, perimeter: 20 },
  roofing: {
    span: 3,
    height: 1,
    projection: 0.3,
    width: 8,
    sheetLength: 10,
    sideLap: "2.5",
    sides: "2",
  },
  scaffolding: { colHeight: 3, columns: 4, beamLength: 6, beams: 2, floorArea: 40, lumber: "2x3" },
  riprap: { height: 1.5, w1: 0.3, w2: 0.6, length: 10 },
  stairs: {
    riser: 0.17,
    tread: 0.28,
    width: 1,
    steps: 12,
    stringerThickness: 0.12,
    barSpacing: 0.2,
    barDiameter: "10mm",
    mix: "A",
  },
};
