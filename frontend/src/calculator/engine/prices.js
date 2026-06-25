// Curated default unit prices (PHP). Editable in the Price Settings tab.
export const defaultPrices = {
  "Cement||bags": 280,
  "Sand||cu.m": 1400,
  "Gravel 3/4||cu.m": 1500,
  "10mm Steel Bars||pcs @ 6m": 195,
  "12mm Steel Bars||pcs @ 6m": 280,
  "16mm Steel Bars||pcs @ 6m": 495,
  "20mm Steel Bars||pcs @ 6m": 775,
  "Tie Wire||kg": 85,
  '4" CHB||pcs': 14,
  '6" CHB||pcs': 19,
  "Plywood 4x8||sheets": 980,
  "Lumber 2x3x8ft||pcs": 145,
  "CW Nails #2-1/2||kg": 95,
  "CW Nails #4||kg": 95,
  "Finishing Nails #1||kg": 110,
  "Paint||gal": 850,
  "Paint||L": 230,
  "Roof Sheets||pcs": 720,
  "Umbrella Nails||kg": 130,
  "Tiles||pcs": 38,
  "Tile Grout||kg": 95,
  "Adhesive||bags": 320,
  "Cement Mortar||bags": 280,
  "Boards 4x8||pcs": 320,
  "Screws||pcs": 1,
  "Furring Channel 19x50x5m||pcs": 145,
  "Carrying Channel 12x38x5m||pcs": 180,
  "W-Clips||pcs": 4,
  "Blind Rivets||pcs": 1.5,
  "Wall Angle 25x25x3m||pcs": 85,
  "Tape 250ft||rolls": 95,
  "Jointing Compound||bags": 480,
  "Studs 35x76x3m||pcs": 165,
  "Tracks 35x76x3m||pcs": 165,
  "Boulders||cu.m": 1200,
};

export const priceCatalog = Object.keys(defaultPrices).map((k) => {
  const [item, unit] = k.split("||");
  return { item, unit };
});
