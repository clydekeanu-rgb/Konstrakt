import {
  BAR_LENGTH_M,
  TIE_WIRE_INTERSECTIONS_PER_KG,
  CHB_AREA_PER_PIECE,
  CHB_4_MORTAR_CEMENT,
  CHB_6_MORTAR_CEMENT,
  CHB_4_MORTAR_SAND,
  CHB_6_MORTAR_SAND,
  WALL_VERT_BAR_LM,
  WALL_HORIZ_BAR_LM,
  WALL_TIE_WIRE_PER_INTERSECTION,
  WALL_PLASTER_CEMENT,
  WALL_PLASTER_SAND,
  mixClasses,
  tileRates,
  scaffoldingFactors,
  suspendedSlabRates,
  defaults,
  requiredFields,
} from "./constants";

// ---- helpers ----
export const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
export const ceil = (v) => Math.ceil(Math.max(0, num(v)));
export const round = (v) => Math.round((num(v) + Number.EPSILON) * 100) / 100;
export const money = (v) =>
  num(v).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
export const qtyText = (v, whole = false) =>
  whole ? ceil(v).toString() : round(v).toFixed(2);
export const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const row = (category, item, quantity, unit, whole = false, bom = true) => ({
  category,
  item,
  quantity: whole ? ceil(quantity) : round(quantity),
  unit,
  whole,
  bom,
});

const concreteRows = (volume, mix) => [
  row("Concrete", "Concrete Volume", volume, "cu.m", false, false),
  row("Concrete", "Cement", volume * mixClasses[mix].cement, "bags"),
  row("Concrete", "Sand", volume * 0.5, "cu.m"),
  row("Concrete", "Gravel 3/4", volume, "cu.m"),
];

// ---- main calculator ----
export function calculate(id, f) {
  switch (id) {
    case "wall": {
      const gross = num(f.length) * num(f.height);
      const openingArea = (f.openings || []).reduce(
        (s, o) => s + num(o.width) * num(o.height) * num(o.count || o.qty || 1),
        0,
      );
      const net = Math.max(0, gross - openingArea);
      const mortarCement =
        f.chb === "4"
          ? net * CHB_4_MORTAR_CEMENT
          : net * CHB_6_MORTAR_CEMENT;
      const mortarSand =
        f.chb === "4" ? net * CHB_4_MORTAR_SAND : net * CHB_6_MORTAR_SAND;
      const vertRaw = (WALL_VERT_BAR_LM[f.vSpacing] || 0) * net;
      const horizRaw = (WALL_HORIZ_BAR_LM[f.hLayers] || 0) * net;
      const vertIntersections =
        num(f.length) * (WALL_VERT_BAR_LM[f.vSpacing] || 0);
      const horizIntersections = num(f.height) * (num(f.hLayers) * 0.2);
      const rows = [
        row("Area", "Gross Area", gross, "sqm", false, false),
        row("Area", "Opening Area", openingArea, "sqm", false, false),
        row("Area", "Net Area", net, "sqm", false, false),
        row("Masonry", `${f.chb}" CHB`, net / CHB_AREA_PER_PIECE, "pcs", true),
        row("Mortar", "Cement", mortarCement, "bags"),
        row("Mortar", "Sand", mortarSand, "cu.m"),
        row(
          "Reinforcement",
          `${f.vDiameter || "10mm"} Vertical Bars`,
          vertRaw / BAR_LENGTH_M,
          "pcs @ 6m",
          true,
        ),
        row(
          "Reinforcement",
          `${f.hDiameter || "10mm"} Horizontal Bars`,
          horizRaw / BAR_LENGTH_M,
          "pcs @ 6m",
          true,
        ),
        row(
          "Reinforcement",
          "Tie Wire",
          (vertIntersections * horizIntersections * WALL_TIE_WIRE_PER_INTERSECTION) /
            TIE_WIRE_INTERSECTIONS_PER_KG,
          "kg",
        ),
      ];
      if (f.plaster) {
        rows.push(row("Plastering", "Cement", net * WALL_PLASTER_CEMENT * num(f.faces), "bags"));
        rows.push(row("Plastering", "Sand", net * WALL_PLASTER_SAND * num(f.faces), "cu.m"));
      }
      return rows;
    }
    case "footing": {
      const volume = num(f.width) * num(f.length) * num(f.thickness) * num(f.count);
      const barL = Math.max(0, num(f.length) - 2 * num(f.cover));
      const barW = Math.max(0, num(f.width) - 2 * num(f.cover));
      const totalBarLength = (num(f.barsL) * barL + num(f.barsW) * barW) * num(f.count);
      return [
        ...concreteRows(volume, f.mix),
        row("Reinforcement", `${f.barDiameter || "16mm"} Bars`, totalBarLength / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", "Tie Wire", (num(f.barsL) * num(f.barsW) * 0.4 * num(f.count)) / TIE_WIRE_INTERSECTIONS_PER_KG, "kg"),
      ];
    }
    case "column": {
      const volume = num(f.height) * num(f.w1) * num(f.w2) * num(f.count);
      const lengthRequired = num(f.height) + 0.5;
      const cutLength = 2 * (num(f.w1) - 0.02) + 2 * (num(f.w2) - 0.02) + 0.2;
      const stirrups = ceil((num(f.height) + 0.2) / num(f.stirrupSpacing) + 10);
      const colContact = 2 * (num(f.w1) + num(f.w2)) * num(f.height) * num(f.count);
      return [
        ...concreteRows(volume, f.mix),
        row("Reinforcement", `${f.barDiameter} Vertical Bars`, (num(f.verticalBars) * lengthRequired * num(f.count)) / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", `${f.stirrupDiameter || "10mm"} Stirrup Bars`, (cutLength * stirrups * num(f.count)) / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", "Tie Wire", (stirrups * 4 * 0.3 * num(f.count)) / TIE_WIRE_INTERSECTIONS_PER_KG, "kg"),
        row("Formworks", "Contact Area", colContact, "sqm", false, false),
        row("Formworks", "Plywood 4x8", (colContact * 2) / 2.88, "sheets", true),
        row("Formworks", "Lumber 2x3x8ft", colContact * 6.15, "pcs", true),
        row("Formworks", "CW Nails #2-1/2", colContact * 0.2, "kg"),
        row("Formworks", "Finishing Nails #1", colContact * 0.08, "kg"),
      ];
    }
    case "beam": {
      const volume = num(f.length) * num(f.b) * num(f.d) * num(f.count);
      const cutLength = 2 * (num(f.b) - 0.02) + 2 * (num(f.d) - 0.02) + 0.2;
      const stirrups = ceil((num(f.length) + 0.2) / num(f.stirrupSpacing) + 10);
      const beamContact = (num(f.b) + 2 * num(f.d)) * num(f.length) * num(f.count);
      return [
        ...concreteRows(volume, f.mix),
        row("Reinforcement", `${f.topDiameter} Top Bars`, (num(f.topBars) * num(f.length)) / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", `${f.bottomDiameter} Bottom Bars`, (num(f.bottomBars) * num(f.length)) / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", `${f.webDiameter} Web Bars`, (num(f.webBars) * num(f.length)) / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", `${f.stirrupDiameter || "10mm"} Stirrup Bars`, (cutLength * stirrups) / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", "Tie Wire", (stirrups * 4 * 0.3) / TIE_WIRE_INTERSECTIONS_PER_KG, "kg"),
        row("Formworks", "Contact Area", beamContact, "sqm", false, false),
        row("Formworks", "Plywood 4x8", (beamContact * 1.35) / 2.88, "sheets", true),
        row("Formworks", "Lumber 2x3x8ft", beamContact * 6.15, "pcs", true),
        row("Formworks", "CW Nails #2-1/2", beamContact * 0.107, "kg"),
        row("Formworks", "Finishing Nails #1", beamContact * 0.046, "kg"),
      ];
    }
    case "slab": {
      const volume = num(f.length) * num(f.width) * num(f.thickness);
      const countL = (num(f.length) / num(f.spacingL)) * num(f.width);
      const countW = (num(f.width) / num(f.spacingW)) * num(f.length);
      return [
        ...concreteRows(volume, f.mix),
        row("Reinforcement", `${f.diaL} Bars L dir`, countL / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", `${f.diaW} Bars W dir`, countW / BAR_LENGTH_M, "pcs @ 6m", true),
        row("Reinforcement", "Tie Wire", (countL * countW * 0.3) / TIE_WIRE_INTERSECTIONS_PER_KG, "kg"),
      ];
    }
    case "suspendedOneWay":
    case "suspendedTwoWay": {
      const area = num(f.length) * num(f.width);
      const volume = area * num(f.thickness);
      const lookup =
        suspendedSlabRates[id === "suspendedOneWay" ? "oneWay" : "twoWay"][f.spacing] || { c: 0, ties: 0 };
      return [
        row("Area", "Slab Area", area, "sqm", false, false),
        ...concreteRows(volume, f.mix),
        row("Reinforcement", `${f.barDiameter || "10mm"} Bars`, area * lookup.c, "pcs @ 6m", true),
        row("Reinforcement", "Tie Wire", area * lookup.ties, "kg", true),
      ];
    }
    case "tiling": {
      const area = num(f.area);
      return [
        row("Tiles", "Tiles", area * tileRates[f.tileSize] * (1 + num(f.breakage) / 100), "pcs", true),
        row("Setting Materials", "Cement Mortar", area * 0.084, "bags", true),
        row("Setting Materials", "Adhesive", area * 0.11, "bags", true),
        row("Setting Materials", "Tile Grout", area / 2, "kg"),
      ];
    }
    case "paintConcrete":
    case "paintWood": {
      const gallons = ceil((num(f.area) / num(f.coverage)) * num(f.coats));
      return [
        row("Paint", "Paint", gallons, "gal", true),
        row("Paint", "Paint", gallons * 4, "L"),
      ];
    }
    case "ceiling": {
      const area = num(f.length) * num(f.width);
      const perimeter = 2 * (num(f.length) + num(f.width));
      const boards = ceil(area / 2.88);
      const furring = ceil(area / 3);
      const wClips = furring * 2;
      return [
        row("Area", "Ceiling Area", area, "sqm", false, false),
        row("Area", "Perimeter", perimeter, "lm", false, false),
        row("Ceiling", "Boards 4x8", boards, "pcs", true),
        row("Ceiling", "Screws", boards * 42, "pcs", true),
        row("Ceiling", "Furring Channel 19x50x5m", furring, "pcs", true),
        row("Ceiling", "Carrying Channel 12x38x5m", area / 4, "pcs", true),
        row("Ceiling", "W-Clips", wClips, "pcs", true),
        row("Ceiling", "Blind Rivets", wClips * 3, "pcs", true),
        row("Ceiling", "Wall Angle 25x25x3m", perimeter / 3, "pcs", true),
      ];
    }
    case "drywall": {
      const boards = ceil((num(f.area) / 2.88) * 2);
      const studs = ceil(num(f.area) / (0.6 * 3));
      return [
        row("Drywall", "Boards 4x8", boards, "pcs", true),
        row("Drywall", "Screws", boards * 42, "pcs", true),
        row("Drywall", "Tape 250ft", boards / 2, "rolls", true),
        row("Drywall", "Jointing Compound", num(f.area) / 20, "bags", true),
        row("Drywall", "Studs 35x76x3m", studs, "pcs", true),
        row("Drywall", "Tracks 35x76x3m", (num(f.perimeter) * 2) / 3, "pcs", true),
        row("Drywall", "Blind Rivets", studs * 4, "pcs", true),
      ];
    }
    case "roofing": {
      const rafter = Math.sqrt(num(f.span) ** 2 + num(f.height) ** 2) + num(f.projection);
      const roofingLength = rafter + 0.25;
      const effectiveWidth = f.sideLap === "2.5" ? 0.6 : 0.7;
      const sheetLengthM = num(f.sheetLength) * 0.3048;
      const sheets =
        ceil(roofingLength / sheetLengthM) *
        ceil(num(f.width) / effectiveWidth) *
        num(f.sides);
      return [
        row("Roof Geometry", "Rafter Length", rafter, "m", false, false),
        row("Roof Geometry", "Roofing Length", roofingLength, "m", false, false),
        row("Roofing", "Roof Sheets", sheets, "pcs", true),
        row("Roofing", "Umbrella Nails", sheets * 0.3, "kg", true),
      ];
    }
    case "scaffolding": {
      const factor = scaffoldingFactors[f.lumber];
      const colBd =
        num(f.columns) * num(f.colHeight) * (factor.vert + factor.horiz + factor.brace);
      const beamBd = num(f.beams) * num(f.beamLength) * (factor.vert + factor.horiz);
      const floorBd = num(f.floorArea) * 6.1;
      const total = colBd + beamBd + floorBd;
      const divisor = (factor.w1 * factor.w2 * 8) / 12;
      const lumber = ceil(total / divisor);
      return [
        row("Scaffolding", "Column Board Feet", colBd, "bd.ft", false, false),
        row("Scaffolding", "Beam Board Feet", beamBd, "bd.ft", false, false),
        row("Scaffolding", "Floor Board Feet", floorBd, "bd.ft", false, false),
        row("Scaffolding", "Total Board Feet", total, "bd.ft", false, false),
        row("Scaffolding", `Lumber ${f.lumber}x8ft`, lumber, "pcs", true),
        row("Scaffolding", "CW Nails #4", lumber * 0.51, "kg", true),
      ];
    }
    case "riprap": {
      const sideArea = ((num(f.w1) + num(f.w2)) / 2) * num(f.height);
      const volume = sideArea * num(f.length);
      return [
        row("Riprapping", "Side Area", sideArea, "sqm", false, false),
        row("Riprapping", "Volume", volume, "cu.m", false, false),
        row("Riprapping", "Boulders", volume, "cu.m"),
        row("Riprapping", "Cement", volume * 2.58, "bags"),
        row("Riprapping", "Sand", volume * 0.143, "cu.m"),
      ];
    }
    case "stairs": {
      const diagonal = Math.sqrt(num(f.riser) ** 2 + num(f.tread) ** 2);
      const stringerLength = num(f.steps) * diagonal;
      const stepsVol = (num(f.steps) * num(f.riser) * num(f.tread) * num(f.width)) / 2;
      const stringerVol = num(f.steps) * diagonal * num(f.width) * num(f.stringerThickness);
      const totalVol = stepsVol + stringerVol;
      const positions = ceil(stringerLength / num(f.barSpacing));
      const stepLat = ceil((positions * num(f.width)) / BAR_LENGTH_M) * 2;
      const stepHoriz = stepLat + 1;
      const slabLatPos = ceil(num(f.width) / num(f.barSpacing)) + 2;
      const slabLat = ceil((slabLatPos * stringerLength) / BAR_LENGTH_M);
      const slabHorizPos = ceil(stringerLength / num(f.barSpacing)) + 1;
      const slabHoriz = ceil((slabHorizPos * num(f.width)) / BAR_LENGTH_M);
      const totalBars = stepLat + stepHoriz + slabLat + slabHoriz;
      return [
        row("Concrete", "Step Diagonal", diagonal, "m", false, false),
        row("Concrete", "Stringer Length", stringerLength, "m", false, false),
        row("Concrete", "Steps Volume", stepsVol, "cu.m", false, false),
        row("Concrete", "Stringer Volume", stringerVol, "cu.m", false, false),
        ...concreteRows(totalVol, f.mix),
        row("Reinforcement - Steps", `${f.barDiameter || "10mm"} Lateral Bars`, stepLat, "pcs @ 6m", true),
        row("Reinforcement - Steps", `${f.barDiameter || "10mm"} Horizontal Bars`, stepHoriz, "pcs @ 6m", true),
        row("Reinforcement - Stringer", `${f.barDiameter || "10mm"} Lateral Bars`, slabLat, "pcs @ 6m", true),
        row("Reinforcement - Stringer", `${f.barDiameter || "10mm"} Horizontal Bars`, slabHoriz, "pcs @ 6m", true),
        row("Reinforcement", "Tie Wire", (totalBars * 4 * 0.3) / TIE_WIRE_INTERSECTIONS_PER_KG, "kg"),
      ];
    }
    default:
      return [];
  }
}

export function validate(moduleId, form) {
  const warnings = [];
  const fields = requiredFields[moduleId] || [];
  fields.forEach((k) => {
    if (num(form[k]) <= 0) warnings.push(`${k} must be greater than 0`);
  });
  if (moduleId === "slab" && num(form.thickness) > 0 && num(form.thickness) < 0.075)
    warnings.push("Slab thickness seems too low");
  if (
    (moduleId === "suspendedOneWay" || moduleId === "suspendedTwoWay") &&
    num(form.thickness) > 0 &&
    num(form.thickness) < 0.1
  )
    warnings.push("Suspended slab thickness seems too low");
  return warnings;
}

export const cloneDefaultForm = (moduleId) =>
  JSON.parse(JSON.stringify(defaults[moduleId]));
export const isInstanceComplete = (moduleId, form) =>
  (requiredFields[moduleId] || []).every((k) => num(form[k]) > 0);

// material identity helpers (used by BOM aggregation)
export const canonicalMaterial = (item) => {
  const sizedBar = item.item.match(/^((?:10|12|16|20)mm)\s+(?:.+?\s+)*Bars?\b/i);
  if (sizedBar) return { item: `${sizedBar[1]} Steel Bars`, unit: item.unit };
  return { item: item.item, unit: item.unit };
};
export const materialTotalsLabel = (m) =>
  m.item.replace(/^((?:10|12|16|20)mm) Steel Bars$/i, "$1 Bars");
export const displayMaterialName = (item) =>
  materialTotalsLabel(canonicalMaterial(item));
export const priceKey = (item) => {
  const m = canonicalMaterial(item);
  return `${m.item}||${m.unit}`;
};

export const withContingency = (qty, whole, contingency) => {
  const adjusted = num(qty) * (1 + num(contingency) / 100);
  return whole ? ceil(adjusted) : round(adjusted);
};
export const applyContingencyToRows = (rows, contingency) => {
  if (num(contingency) <= 0) return rows;
  return rows.map((item) =>
    item.bom === false
      ? item
      : { ...item, quantity: withContingency(item.quantity, item.whole, contingency) },
  );
};
