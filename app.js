const IN_PER_CM = 1 / 2.54;

const zones = [
  ["A", 65.3], ["A/B", 65.3], ["B", 65.3], ["B/C", 65.3],
  ["C", 65.3], ["C/D", 65.3], ["D", 65.3], ["D/E", 65.3],
  ["E", 65.3], ["E/F", 65.3], ["F", 118.8], ["F/G", 118.8],
  ["G", 118.8], ["G/H", 118.8], ["H", 118.8], ["H/J", 65.3],
  ["J", 65.3], ["J/K", 65.3], ["K", 65.3], ["K/L", 65.3],
  ["L", 65.3], ["L/M", 65.3], ["M", 65.3], ["M/P", 65.3],
  ["P", 65.3], ["R", 65.3],
];

const pallets = {
  "125x96": {
    label: "PMC - 125 x 96", code: "PMC", length: 125, width: 96,
    usableLength: 120, usableWidth: 91, tare: 119, positions: 1,
    sizeCode: "M", lockLimit: 6803, uldMaxGross: 6803, netWeight: "NME 18 kg",
    structural: false,
    manualLabel: "ULDs.pdf page 52: PMC base 96 x 125, usable 91 x 120",
    caps: { wing: { sbs: 7425, center: 11339 }, offWing: { sbs: 5896, center: 8164 } },
  },
  "125x88": {
    label: "PAJ - 88 x 125", code: "PAJ", length: 125, width: 88,
    usableLength: 120, usableWidth: 83, tare: 110, positions: 1,
    sizeCode: "A", lockLimit: 6803, uldMaxGross: 6803, netWeight: "NME 18 kg",
    structural: false,
    manualLabel: "ULDs.pdf page 52: PAJ base 88 x 125, usable 83 x 120",
    caps: { wing: { sbs: 7425, center: null }, offWing: { sbs: 5896, center: null } },
  },
  "16ft": {
    label: "PRA - 16 ft", code: "PRA", length: 196, width: 96,
    usableLength: 191, usableWidth: 91, tare: 492, positions: 2,
    sizeCode: "R", lockLimit: 11339, uldMaxGross: 13608, netWeight: "NGE 37 kg",
    structural: true,
    manualLabel: "ULDs.pdf page 52: PRA base 96 x 196, usable 91 x 191",
    caps: { wing: { sbs: 11643, center: 17780 }, offWing: { sbs: 9244, center: 12800 } },
  },
  "20ft": {
    label: "PGE - 20 ft", code: "PGE", length: 238.5, width: 96,
    usableLength: 233, usableWidth: 91, tare: 580, positions: 2,
    sizeCode: "G", lockLimit: 11339, uldMaxGross: 13608, netWeight: "NGE 37 kg",
    structural: true,
    manualLabel: "ULDs.pdf page 52: PGE base 96 x 238.5, usable 91 x 233",
    caps: { wing: { sbs: 14170, center: 21636 }, offWing: { sbs: 11249, center: 15576 } },
  },
};

const shoringManual = {
  source: "CSM 5.2.2.8, Rev.42, 25 May 2026",
  checkFromKg: 300,
  structuralRequiredKg: 5500,
  nonStructuralMinThickness: 4,
  structuralMinThickness: 2,
  elementaryMaxCreditEachSide: 6,
  crossBeamKg: 2000,
  minCrossBeams: 4,
  woodenPalletCreditKg: 1000,
  maxBeamSpacing: 20,
};

const forwardOverhangRule = {
  pallet: "20ft",
  maxCm: 180,
  maxIn: 180 * IN_PER_CM,
  raiseIn: 12,
};

const holdContourProfiles = {
  A: {
    sbsAp: { label: "A code PA at A/P", baseWidth: 88, maxHeight: 116, topWidth: 41.6, volumeFt3: 677 },
    sbsBm: { label: "A code PA at B-M", baseWidth: 88, maxHeight: 118, topWidth: 48.4, volumeFt3: 707 },
    lateralR: { label: "A code PA at R lateral", baseWidth: 125, maxHeight: 96, topWidth: 120.4, volumeFt3: 611 },
  },
  M: {
    sbsAp: { label: "M code PM at A/P", baseWidth: 96, maxHeight: 116, topWidth: 41.6, volumeFt3: 678 },
    sbsBm: { label: "M code PM at B-M", baseWidth: 96, maxHeight: 118, topWidth: 48.4, volumeFt3: 746 },
    center: { label: "M code PM centreline", baseWidth: 96, maxHeight: 118, topWidth: 48.4, volumeFt3: 819 },
    lateralR: { label: "M code PM at R lateral", baseWidth: 125, maxHeight: 96, topWidth: 120.4, volumeFt3: 667 },
  },
  G: {
    sbsAp: { label: "G code PG at ABL/MPL", baseWidth: 96, maxHeight: 116, topWidth: 41.6, volumeFt3: 1400 },
    sbsBm: { label: "G code PG at CDL/GHL", baseWidth: 96, maxHeight: 118, topWidth: 48.4, volumeFt3: 1419 },
    center: { label: "G code PG EF-JK centreline", baseWidth: 96, maxHeight: 118, topWidth: 48.4, volumeFt3: 1419 },
  },
  R: {
    sbsAp: { label: "R code PR at ABL/MPL", baseWidth: 96, maxHeight: 116, topWidth: 41.6, volumeFt3: 1127 },
    sbsBm: { label: "R code PR at CDL/GHL", baseWidth: 96, maxHeight: 118, topWidth: 48.2, volumeFt3: 1140 },
    center: { label: "R code PR EF-JK centreline", baseWidth: 96, maxHeight: 118, topWidth: 48.2, volumeFt3: 1140 },
    lateral: { label: "R code PR lateral A/P or B-M", baseWidth: 196, maxHeight: 118, topWidth: 120.4, volumeFt3: 1172 },
  },
};

const zoneMaximums = {
  A: 10588, B: 14904, C: 11218, D: 11218, E: 10588,
  F: 14850, G: 14850, H: 14850, J: 11218, K: 10588,
  L: 11218, M: 11218, P: 11007, R: 3527,
};

const pdfMainDeckLimits = {
  "125x88": {
    sbs: { AE: 5896, FH: 6803, JP: 5896, R: 3233 },
    center: { AE: null, FH: null, JP: null, R: null },
    lock: { sbs: { AE: 4082, FH: 6803, JP: 4082, R: 3233 }, center: { AE: null, FH: null, JP: null, R: null } },
    sourceLabel: "A (88 x 125)",
  },
  "125x96": {
    sbs: { AE: 5896, FH: 6803, JP: 5896, R: 3527 },
    center: { AE: 6803, FH: 6803, JP: 6803, R: 3527 },
    lock: { sbs: { AE: 4082, FH: 6803, JP: 4082, R: 3527 }, center: { AE: 6803, FH: 6803, JP: 6803, R: 3527 } },
    sourceLabel: "M (96 x 125)",
  },
  "16ft": {
    sbs: { AE: 9244, FH: 11339, JP: 9244, R: null },
    center: { AE: 11339, FH: 11339, JP: 11339, R: null },
    lateral: { AE: 6268, FH: 11339, JP: 6268, R: null },
    lock: { sbs: { AE: 9244, FH: 11339, JP: 9244, R: null }, center: { AE: 11339, FH: 11339, JP: 11339, R: null } },
    sourceLabel: "16 ft",
  },
  "20ft": {
    sbs: { AE: 11249, FH: 11339, JP: 11249, R: null },
    center: { AE: 11339, FH: 11339, JP: 11339, R: null },
    lock: { sbs: { AE: 11249, FH: 11339, JP: 11249, R: null }, center: { AE: 11339, FH: 11339, JP: 11339, R: null } },
    sourceLabel: "20 ft",
  },
};

function engineRule({
  label,
  manufacturer,
  stand = "",
  length,
  width,
  height,
  weight,
  sbsPositions = null,
  centerPositions = null,
  recommendedPallet = "20ft",
  note = "",
  cannotAccept = false,
  specialPermission = false,
}) {
  const allowedModes = [
    sbsPositions ? "sbs" : null,
    centerPositions ? "center" : null,
  ].filter(Boolean);
  const firstMode = allowedModes[0] || "center";
  const positions = firstMode === "sbs" ? sbsPositions : centerPositions;
  const locationText = [
    sbsPositions ? `SBS ${sbsPositions} positions` : null,
    centerPositions ? `CL ${centerPositions} positions` : null,
  ].filter(Boolean).join(" / ");

  return {
    label: `${manufacturer} ${label}`,
    requiredMode: allowedModes.length === 1 ? allowedModes[0] : null,
    allowedModes,
    minPositions: positions || 0,
    qrgPositions: { sbs: sbsPositions, center: centerPositions },
    recommendedPallet,
    cannotAccept,
    specialPermission,
    engineData: { manufacturer, model: label, stand, length, width, height, weight, locationText },
    note: cannotAccept
      ? "Engine QRG states this engine cannot be accepted."
      : `${locationText}. ${note || "Use Engine QRG Rev.03 loading note."}`,
  };
}

const engineItems = {
  "engine-cfm56": engineRule({ manufacturer: "CFM", label: "CFM56 series", length: 511, width: 251, height: 254, weight: 5318, sbsPositions: 2, centerPositions: 4, note: "20ft pallet loading; SBS only if GOM 11.5.7.5.6.6.4 is followed." }),
  "engine-cf34": engineRule({ manufacturer: "GE", label: "CF34-8E / CF34-10", stand: "2C81052 / AGSE-E186-G03", length: 427, width: 208, height: 231, weight: 2760, sbsPositions: 2, centerPositions: 4, note: "20ft pallet loading; SBS only if GOM 11.5.7.5.6.6.4 is followed." }),
  "engine-cf6": engineRule({ manufacturer: "GE", label: "CF6-80 series", stand: "AM1928-155", length: 457, width: 290, height: 295, weight: 7000, centerPositions: 4, note: "16 or 20ft pallet loading required." }),
  "engine-leap": engineRule({ manufacturer: "CFM", label: "LEAP 1A/1B/1C", stand: "AGSE-E247-G02", length: 488, width: 267, height: 302, weight: 7180, centerPositions: 4, note: "16 or 20ft pallet loading required." }),
  "engine-f100": engineRule({ manufacturer: "PW", label: "F101 / F108 / F110", length: 472, width: 251, height: 170, weight: 3586, sbsPositions: 2, note: "20ft pallet loading; SBS only if GOM 11.5.7.5.6.6.4 is followed." }),
  "engine-f117": engineRule({ manufacturer: "PW", label: "F117", length: 820, width: 152, height: 244, weight: 11450, cannotAccept: true }),
  "engine-j57-j79": engineRule({ manufacturer: "PW", label: "J57 / J79", length: 429, width: 191, height: 150, weight: 2550, centerPositions: 4, note: "16 or 20ft pallet loading required." }),
  "engine-ge90": engineRule({ manufacturer: "GE", label: "GE90-94B/115B", stand: "AGSE-C060-G02", length: 640, width: 259, height: 262, weight: 11000, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-genx2b": engineRule({ manufacturer: "GE", label: "GEnX-2B", stand: "AGSE-E176-G04", length: 500, width: 325, height: 310, weight: 12200, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-gp7200": engineRule({ manufacturer: "GE", label: "GP7200", stand: "PWA107321 / AGSE-E143-G01", length: 554, width: 307, height: 269, weight: 10300, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-genx1b-light": engineRule({ manufacturer: "GE", label: "GEnX-1B up to 10,000 kg", stand: "AGSE-E175-G04", length: 579, width: 259, height: 259, weight: 9800, centerPositions: 4, note: "If gross weight exceeds 10,000 kg this becomes CL 6 positions." }),
  "engine-genx1b-heavy": engineRule({ manufacturer: "GE", label: "GEnX-1B over 10,000 kg", stand: "11C3359P02", length: 521, width: 244, height: 310, weight: 12900, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-jt9d": engineRule({ manufacturer: "PW", label: "JT9D", stand: "AM-2372 / AM-2438", length: 635, width: 247, height: 271, weight: 7580, centerPositions: 4, note: "20ft pallet loading required." }),
  "engine-pw1100g": engineRule({ manufacturer: "PW", label: "PW1100G", length: 340, width: 222, height: 245, weight: 2857, centerPositions: 4, note: "16 or 20ft pallet loading required." }),
  "engine-pw4000": engineRule({ manufacturer: "PW", label: "PW4000 / PW4168 / PW4170", stand: "AM-2436", length: 541, width: 310, height: 300, weight: 8700, centerPositions: 4, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-pw4000-112": engineRule({ manufacturer: "PW", label: "PW4000-112", stand: "AM-2774-100", length: 580, width: 310, height: 300, weight: 11000, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-rb211-524": engineRule({ manufacturer: "Rolls-Royce", label: "RB211-524", stand: "NGRB2524 Engine stand", length: 643, width: 288, height: 295, weight: 7980, centerPositions: 4, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-rb211-535": engineRule({ manufacturer: "Rolls-Royce", label: "RB211-535", stand: "AGSE-AM2510R88", length: 590, width: 243, height: 271, weight: 5790, centerPositions: 4, note: "20ft pallet loading required." }),
  "engine-br700": engineRule({ manufacturer: "Rolls-Royce", label: "BR710 / BR715 / BR725", stand: "NEXTGEN / stand as applicable", length: 425, width: 200, height: 200, weight: 3200, sbsPositions: 2, centerPositions: 4, note: "20ft pallet loading; SBS only if GOM 11.5.7.5.6.6.4 is followed." }),
  "engine-trent500": engineRule({ manufacturer: "Rolls-Royce", label: "Trent 500", stand: "AGSE-E074", length: 500, width: 305, height: 309, weight: 8045, centerPositions: 4, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-trent700": engineRule({ manufacturer: "Rolls-Royce", label: "Trent 700", stand: "AGSE-E074", length: 510, width: 320, height: 305, weight: 7606, centerPositions: 4, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-trent7000": engineRule({ manufacturer: "Rolls-Royce", label: "Trent 7000", stand: "RRT095052 all purpose stand", length: 498, width: 335, height: 309, weight: 12486, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-trent800": engineRule({ manufacturer: "Rolls-Royce", label: "Trent 800", stand: "Stanley Aviation M190100", length: 523, width: 333, height: 307, weight: 10300, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-trent900": engineRule({ manufacturer: "Rolls-Royce", label: "Trent 900", stand: "AGSE-E166-G03", length: 513, width: 338, height: 310, weight: 11500, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-trent1000": engineRule({ manufacturer: "Rolls-Royce", label: "Trent 1000", stand: "APS 4400-0001-000 HYDRO", length: 498, width: 335, height: 310, weight: 12700, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-xwb-stand": engineRule({ manufacturer: "Rolls-Royce", label: "XWB engine stand", stand: "RRT057891-4", length: 527, width: 300, height: 285, weight: 13680, centerPositions: 6, note: "20ft pallet loading required unless integration with own stand is available." }),
  "engine-xwb-fancase": engineRule({ manufacturer: "Rolls-Royce", label: "XWB Fan Case", stand: "RRT057892 Hydra stand", length: 498, width: 343, height: 302, weight: 9680, centerPositions: 4, specialPermission: true, note: "CL 4 positions with special permission." }),
  "engine-v2500": engineRule({ manufacturer: "IAE", label: "V2500", stand: "AM2599 / AM2805 / AM2228-A1-B1", length: 419, width: 244, height: 269, weight: 5032, sbsPositions: 2, centerPositions: 4, note: "20ft pallet loading; SBS only if GOM 11.5.7.5.6.6.4 is followed." }),
};

const specialItems = {
  none: {
    label: "None",
    requiredMode: null,
    allowedModes: null,
    minPositions: 0,
    recommendedPallet: null,
    note: "No special-item override.",
  },
  ...engineItems,
  custom: {
    label: "Custom special item",
    requiredMode: null,
    allowedModes: null,
    minPositions: 0,
    recommendedPallet: null,
    note: "Use the custom override fields.",
  },
};

const widthBreaks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140];
const doorRows = new Map([
  [120, [319, 286, 260, 239, 220, 205, 191, 173, 149, 100, 100, 100, 100, 100]],
  [118, [335, 300, 271, 249, 229, 212, 199, 182, 161, 131, 106, 106, 106, 106]],
  [116, [353, 314, 284, 259, 238, 221, 206, 191, 171, 145, 111, 111, 111, 111]],
  [114, [372, 330, 296, 270, 248, 229, 214, 199, 181, 157, 125, 117, 117, 117]],
  [112, [393, 346, 310, 281, 257, 238, 221, 207, 189, 168, 140, 123, 123, 123]],
  [110, [415, 364, 325, 293, 268, 247, 229, 214, 198, 177, 152, 129, 129, 129]],
  [108, [439, 376, 340, 306, 279, 256, 237, 221, 206, 186, 162, 135, 135, 135]],
  [106, [456, 383, 352, 316, 288, 265, 246, 229, 213, 195, 172, 143, 140, 140]],
  [104, [484, 408, 369, 330, 300, 275, 254, 236, 221, 203, 181, 153, 146, 146]],
  [102, [513, 440, 386, 345, 312, 285, 263, 242, 228, 211, 189, 163, 152, 152]],
  [100, [561, 474, 412, 364, 327, 297, 271, 252, 235, 218, 198, 172, 158, 158]],
  [98, [580, 490, 424, 375, 337, 306, 281, 260, 242, 225, 205, 180, 163, 163]],
  [85.5, [839, 666, 553, 474, 415, 370, 333, 304, 281, 259, 241, 219, 192, 192]],
]);

function roundUp(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.ceil(value * factor - Number.EPSILON) / factor;
}

function roundDown(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.floor(value * factor + Number.EPSILON) / factor;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function fmt(value, digits = 0, unit = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })}${unit}`;
}

function exactDoorRow(height) {
  if (doorRows.has(height)) return doorRows.get(height);
  if (height > 120) return null;
  if (height < 85.5) return doorRows.get(85.5);

  if (height >= 98) {
    const lowerEven = height % 2 === 0 ? height : height - 1;
    const upperEven = lowerEven + 2;
    const upper = doorRows.get(upperEven);
    const lower = doorRows.get(lowerEven);
    if (!upper || !lower) return null;
    return upper.map((value, index) => roundDown(((lower[index] - value) * 0.5) + value));
  }

  const top = doorRows.get(98);
  const bottom = doorRows.get(85.5);
  const step = 98 - height;
  return top.map((value, index) => roundDown(((bottom[index] - value) * (step / 13)) + value));
}

function maxDoorLength(width, builtHeight) {
  const doorWidth = width < 10 ? 10 : Math.round(width);
  const doorHeight = builtHeight < 85.5 ? 85.5 : Math.round(builtHeight);
  if (doorWidth > 140 || doorHeight > 120) return null;
  const row = exactDoorRow(doorHeight);
  if (!row) return null;

  if (doorWidth <= 10) return row[0];
  const last = widthBreaks[widthBreaks.length - 1];
  if (doorWidth >= last) return row[row.length - 1];

  const leftIndex = Math.floor((doorWidth - 10) / 10);
  const leftWidth = widthBreaks[leftIndex];
  const fraction = (doorWidth - leftWidth) / 10;
  return roundDown(row[leftIndex] + ((row[leftIndex + 1] - row[leftIndex]) * fraction));
}

function selectedZoneGroup(zone) {
  return ["F", "F/G", "G", "G/H", "H"].includes(zone) ? "wing" : "offWing";
}

function selectedPositionFamily(zone) {
  const firstZone = zone.split("/")[0];
  if (["A", "B", "C", "D", "E"].includes(firstZone)) return "AE";
  if (["F", "G", "H"].includes(firstZone)) return "FH";
  if (["J", "K", "L", "M", "P"].includes(firstZone)) return "JP";
  if (firstZone === "R") return "R";
  return "JP";
}

function getZoneMaximum(zone) {
  const parts = zone.split("/").filter(Boolean);
  const values = parts.map((part) => zoneMaximums[part]).filter((value) => value !== undefined);
  return values.length ? Math.min(...values) : null;
}

function getUldLimit(pallet, mode, zone) {
  const limits = pdfMainDeckLimits[pallet];
  const family = selectedPositionFamily(zone);
  return limits?.[mode]?.[family] ?? null;
}

function getLockLimit(pallet, mode, zone) {
  const limits = pdfMainDeckLimits[pallet];
  const family = selectedPositionFamily(zone);
  return limits?.lock?.[mode]?.[family] ?? getUldLimit(pallet, mode, zone);
}

function selectedDeckFamily(zone) {
  return zone === "A" || zone === "A/B" || zone === "M/P" || zone === "P" ? "ap" : "bm";
}

function getMaxSbsHeight(widthForHeight, family) {
  if (family === "ap") {
    if (widthForHeight > 96) return null;
    if (widthForHeight <= 41.6) return 116;
    return round1(116 + ((widthForHeight - 41.6) * -1.193));
  }
  if (widthForHeight > 96) return null;
  if (widthForHeight <= 48.2) return 118;
  return -0.89 * widthForHeight + 160.9;
}

function selectedDeckLane(input, mode) {
  if (mode.mode === "center" || input.deckLane === "center") return "center";
  if (input.deckLane === "left" || input.deckLane === "right") return input.deckLane;
  return "left";
}

function getSbsProfileKey(zone) {
  return selectedDeckFamily(zone) === "ap" ? "sbsAp" : "sbsBm";
}

function resolveHoldContour(input, pallet, mode, shoring) {
  const profileSet = holdContourProfiles[pallet.sizeCode] || holdContourProfiles.M;
  const zoneIsR = input.zone.split("/")[0] === "R";
  const profileKey = zoneIsR && profileSet.lateralR
    ? "lateralR"
    : mode.mode === "center"
      ? "center"
      : getSbsProfileKey(input.zone);
  const profile = profileSet[profileKey] || profileSet[getSbsProfileKey(input.zone)] || profileSet.center;
  const centerStructuralCrossload = mode.mode === "center" && pallet.structural && pallet.length > 130;
  const widthLimit = centerStructuralCrossload
    ? Math.max(profile.baseWidth || pallet.width, pallet.usableLength || pallet.length)
    : profile.baseWidth || pallet.width;
  const heightOk = shoring.builtHeight <= profile.maxHeight + 0.0001;
  const widthOk = input.widthIn <= widthLimit + 0.0001;
  const standardLengthLimit = centerStructuralCrossload
    ? pallet.usableLength || pallet.length
    : pallet.length + Math.max(0, shoring.thickness * 2);
  const lengthLimit = shoring.forwardOverhang?.applies
    ? (pallet.usableLength || pallet.length) + shoring.forwardOverhang.maxIn
    : standardLengthLimit;
  const lengthOk = input.lengthIn <= lengthLimit + 0.0001;

  return {
    ...profile,
    profileKey,
    widthLimit,
    lengthLimit,
    centerStructuralCrossload,
    heightOk,
    widthOk,
    lengthOk,
    fits: heightOk && widthOk && lengthOk,
  };
}

function selectShoringMethod({ rawLineOk, rawAreaOk, spreadLength, spreadWidth, pallet, weightKg, cargoWidthIn, shoringWidth }) {
  if (rawLineOk && rawAreaOk && spreadLength <= 0 && spreadWidth <= 0) {
    return {
      key: "none",
      label: "No shoring",
      description: "Applied linear and area loads are within limits without added load spread.",
      minThickness: 0,
      structuralRequired: weightKg >= shoringManual.structuralRequiredKg && !pallet.structural,
      secondaryLayer: false,
    };
  }

  const bothLoadLimitsExceeded = !rawLineOk && !rawAreaOk;
  const needsMoreThanElementaryCredit = spreadLength > shoringManual.elementaryMaxCreditEachSide || spreadWidth > shoringManual.elementaryMaxCreditEachSide;
  const cargoNarrowerThanShoring = cargoWidthIn < shoringWidth - 0.0001;
  const complex = bothLoadLimitsExceeded || needsMoreThanElementaryCredit || cargoNarrowerThanShoring;

  if (complex) {
    return {
      key: bothLoadLimitsExceeded || cargoNarrowerThanShoring ? "combined" : "complex",
      label: bothLoadLimitsExceeded || cargoNarrowerThanShoring ? "Complex combined shoring" : "Complex longitudinal shoring",
      description: bothLoadLimitsExceeded
        ? "Use combined longitudinal and lateral shoring because both linear and area load limits are exceeded."
        : cargoNarrowerThanShoring
          ? "Use lateral beams above the forward-aft base layer because the cargo is narrower than the required shoring width."
          : "Use complex shoring because the required spread exceeds elementary shoring credit.",
      minThickness: shoringManual.structuralMinThickness,
      structuralRequired: !pallet.structural,
      secondaryLayer: bothLoadLimitsExceeded || cargoNarrowerThanShoring,
    };
  }

  return {
    key: "simplified",
    label: "Simplified main-deck shoring",
    description: "Extend the cargo footprint in the required direction while remaining within the linear and area limits.",
    minThickness: pallet.structural ? shoringManual.structuralMinThickness : shoringManual.nonStructuralMinThickness,
    structuralRequired: weightKg >= shoringManual.structuralRequiredKg && !pallet.structural,
    secondaryLayer: false,
  };
}

function resolveForwardOverhang(lengthIn, palletKey, pallet) {
  const overhangIn = Math.max(0, lengthIn - (pallet.usableLength || pallet.length));
  const applies = palletKey === forwardOverhangRule.pallet && overhangIn > 0;
  const allowed = applies && overhangIn <= forwardOverhangRule.maxIn + 0.0001;

  return {
    applies,
    allowed,
    overhangIn: applies ? overhangIn : 0,
    maxIn: forwardOverhangRule.maxIn,
    raiseIn: allowed ? forwardOverhangRule.raiseIn : 0,
  };
}

function calculateShoring({ lengthIn, widthIn, heightIn, weightKg, pallet, extraLayer }) {
  const areaLimit = 136;
  const lineLimit = zones.find(([name]) => name === getValue("zone"))?.[1] || 65.3;
  const p = pallets[pallet];
  const usableLength = p.usableLength || (p.length === 125 ? 121 : p.length);
  const usableWidth = p.usableWidth || (p.width - 4);
  const calcLength = Math.min(lengthIn, usableLength);
  const calcWidth = Math.min(widthIn, usableWidth);
  const shoringDueSize = lengthIn > usableLength || widthIn > usableWidth;

  const g4 = weightKg === 0 ? 0 : (weightKg / areaLimit) * 144;
  const g5 = Math.sqrt(g4);
  const g6 = lineLimit === 0 ? 0 : weightKg / lineLimit;
  const g7 = g6 < lengthIn ? lengthIn : g6;
  const g8 = g5 >= 96 ? g4 / 96 : g5;
  const active = areaLimit && lineLimit && lengthIn && weightKg ? 1 : 0;
  const minLength = active ? Math.max(g8, g7) : 0;
  let minWidth = 0;

  if (active) {
    if ((weightKg / areaLimit) > 64) {
      minWidth = minLength > Math.sqrt(weightKg / areaLimit) * 12 ? g4 / minLength : 96;
    } else {
      minWidth = (g4 / minLength) <= widthIn ? widthIn : g4 / minLength;
    }
  }

  const spread = active ? Math.max((minLength - lengthIn) / 2, (minWidth - widthIn) / 2) : 0;
  const spreadLength = active ? Math.max(0, (minLength - lengthIn) / 2) : 0;
  const spreadWidth = active ? Math.max(0, (minWidth - widthIn) / 2) : 0;
  const rawThickness = spread < 4 ? Math.max(0, spread) : spread <= 24 ? 4 : spread / 6;
  const rawLineLoad = lengthIn > 0 ? weightKg / lengthIn : 0;
  const rawAreaLoad = lengthIn > 0 && widthIn > 0 ? weightKg / ((lengthIn * widthIn) / 144) : 0;
  const rawLineOk = rawLineLoad <= lineLimit + 0.0001;
  const rawAreaOk = rawAreaLoad <= areaLimit + 0.0001;
  const method = selectShoringMethod({
    rawLineOk,
    rawAreaOk,
    spreadLength,
    spreadWidth,
    pallet: p,
    weightKg,
    cargoWidthIn: widthIn,
    shoringWidth: minWidth,
  });
  const thickness = method.key === "none"
    ? 0
    : Math.max(method.minThickness, roundUp(rawThickness));
  const palletHeight = p.length === 196 || p.length === 238.5 ? 2 : 0;
  const forwardOverhang = resolveForwardOverhang(lengthIn, pallet, p);
  const builtHeight = heightIn + thickness + palletHeight + extraLayer + forwardOverhang.raiseIn;
  const shoringWeight = thickness > 0 ? weightKg * 0.03 : 0;
  const builtWeight = weightKg + shoringWeight + p.tare;
  const beamPlan = calculateBeamPlan(thickness, minLength, minWidth, weightKg, method.secondaryLayer);

  return {
    areaLimit,
    lineLimit,
    usableLength,
    usableWidth,
    shoringDueSize,
    shoringDueWeight: rawThickness > 0,
    spreadLength,
    spreadWidth,
    rawThickness,
    thickness,
    method,
    minWidth,
    minLength,
    areaAfter: thickness > 0 ? weightKg / ((minLength * minWidth) / 144) : weightKg / ((lengthIn * widthIn) / 144),
    lineAfter: thickness > 0 ? weightKg / minLength : weightKg / lengthIn,
    builtHeight,
    shoringWeight,
    builtWeight,
    palletHeight,
    forwardOverhang,
    solidTimberOnly: rawThickness > 3.99,
    beamPlan,
  };
}

function calculateBeamPlan(thickness, shoringLength, shoringWidth, weightKg, secondaryLayer) {
  if (thickness <= 0 || shoringLength <= 0 || shoringWidth <= 0) {
    return {
      required: false,
      count: 0,
      baseCount: 0,
      crossCount: 0,
      spacing: 0,
      length: 0,
      coveredLength: 0,
      maxSpacing: shoringManual.maxBeamSpacing,
    };
  }

  const maxSpacing = shoringManual.maxBeamSpacing;
  const count = Math.max(2, Math.ceil(shoringLength / maxSpacing) + 1);
  const crossCount = secondaryLayer ? Math.max(shoringManual.minCrossBeams, Math.ceil(weightKg / shoringManual.crossBeamKg)) : 0;
  const spacing = shoringLength / (count - 1);

  return {
    required: true,
    count,
    baseCount: count,
    crossCount,
    spacing,
    length: shoringWidth,
    coveredLength: shoringLength,
    maxSpacing,
  };
}

function resolveMode(inputMode, pallet, zone, builtHeight, widthForHeight) {
  const family = selectedDeckFamily(zone);
  const sbsMaxHeight = getMaxSbsHeight(widthForHeight, family);
  const sbsHeightOk = sbsMaxHeight !== null && sbsMaxHeight > builtHeight;
  const centerAllowed = getUldLimit(pallet, "center", zone) !== null;

  if (inputMode === "sbs") return { mode: "sbs", sbsMaxHeight, sbsHeightOk, centerAllowed };
  if (inputMode === "center") return { mode: "center", sbsMaxHeight, sbsHeightOk, centerAllowed };
  return { mode: sbsHeightOk ? "sbs" : "center", sbsMaxHeight, sbsHeightOk, centerAllowed };
}

function getValue(id) {
  return document.getElementById(id).value;
}

function getSpecialRule() {
  const key = getValue("specialItem");
  const preset = specialItems[key] || specialItems.none;

  if (key !== "custom") return { key, ...preset };

  const customMode = getValue("customRequiredMode");
  return {
    key,
    ...preset,
    requiredMode: customMode === "none" ? null : customMode,
    allowedModes: null,
    minPositions: Math.max(0, Number(getValue("customMinPositions")) || 0),
    note: "Custom special-item override.",
  };
}

function getQrgPositionsForMode(rule, mode) {
  if (!rule?.qrgPositions) return rule?.minPositions || 0;
  return rule.qrgPositions[mode.mode] || rule.qrgPositions.center || rule.qrgPositions.sbs || 0;
}

function getStationSpanForPositions(rule, mode, positions, pallet) {
  if (rule?.qrgPositions) return Math.max(pallet.length > 130 ? 2 : 1, Math.ceil(positions / 2));
  return Math.max(pallet.length > 130 ? 2 : 1, positions);
}

function getEffectiveUldLimit(baseLimit, rule, mode, positions, pallet) {
  if (baseLimit === null || baseLimit === undefined) return baseLimit;
  if (!rule?.qrgPositions) return baseLimit;
  const stationSpan = getStationSpanForPositions(rule, mode, positions, pallet);
  const palletStationSpan = pallet.length > 130 ? 2 : 1;
  return Math.round(baseLimit * (stationSpan / palletStationSpan));
}

function describeQrgMeaning(rule, mode, positions, pallet, deckLane = "left") {
  if (!rule?.qrgPositions) return "Not QRG-driven";
  const stationSpan = getStationSpanForPositions(rule, mode, positions, pallet);
  if (mode.mode === "sbs") {
    const lane = deckLane === "left" ? "left" : "right";
    return `${positions} positions = ${stationSpan} adjacent ${lane} station${stationSpan === 1 ? "" : "s"}`;
  }
  return `${positions} positions = ${stationSpan} centre station${stationSpan === 1 ? "" : "s"}`;
}

function readInputs() {
  const units = document.querySelector("input[name='units']:checked").value;
  const factor = units === "cm" ? IN_PER_CM : 1;
  const selectedPallet = getValue("pallet");
  const selectedExtraLayer = getValue("extraLayer");
  return {
    units,
    lengthRaw: Number(getValue("length")),
    widthRaw: Number(getValue("width")),
    heightRaw: Number(getValue("height")),
    lengthIn: Number(getValue("length")) * factor,
    widthIn: Number(getValue("width")) * factor,
    heightIn: Number(getValue("height")) * factor,
    weightKg: Number(getValue("weight")),
    pieces: Math.max(1, Number(getValue("pieces")) || 1),
    pallet: selectedPallet,
    palletSelection: selectedPallet,
    zone: getValue("zone"),
    deckLane: getValue("deckLane"),
    loadMode: getValue("loadMode"),
    extraLayer: selectedExtraLayer === "auto" ? 0 : Number(selectedExtraLayer),
    extraLayerSelection: selectedExtraLayer,
    specialRule: getSpecialRule(),
  };
}

function resolveAutomatedBuild(input) {
  if (input.palletSelection !== "auto") {
    return { ...input, autoPallet: false };
  }

  const preferred = input.specialRule.recommendedPallet;
  const candidates = preferred
    ? [preferred, ...Object.keys(pallets).filter((key) => key !== preferred)]
    : ["125x88", "125x96", "16ft", "20ft"];
  const evaluated = candidates.map((palletKey) => evaluatePalletCandidate({ ...input, pallet: palletKey }));
  const acceptable = evaluated.filter((item) => item.failures.length === 0);
  const chosen = acceptable.length
    ? [...acceptable].sort((a, b) => a.score - b.score)[0]
    : input.lengthIn > pallets["20ft"].usableLength
      ? evaluated.find((item) => item.palletKey === "20ft") || evaluated[0]
      : [...evaluated].sort((a, b) => a.failures.length - b.failures.length || a.score - b.score)[0] || evaluated[0];

  return {
    ...input,
    pallet: chosen?.palletKey || preferred || "20ft",
    autoPallet: true,
    autoBuild: chosen,
    autoCandidates: evaluated,
  };
}

function evaluatePalletCandidate(candidateInput) {
  const p = pallets[candidateInput.pallet];
  const shoring = calculateShoring(candidateInput);
  const requestedMode = candidateInput.deckLane === "center" ? "center" : candidateInput.specialRule.requiredMode || candidateInput.loadMode;
  const mode = resolveMode(requestedMode, candidateInput.pallet, candidateInput.zone, shoring.builtHeight, Math.min(candidateInput.widthIn, p.width));
  const contour = resolveHoldContour(candidateInput, p, mode, shoring);
  const doorMax = maxDoorLength(candidateInput.widthIn, shoring.builtHeight);
  const doorOk = doorMax !== null && candidateInput.lengthIn <= doorMax;
  const calculatedPositions = p.positions * candidateInput.pieces;
  const qrgPositions = getQrgPositionsForMode(candidateInput.specialRule, mode);
  const requiredPositions = Math.max(calculatedPositions, qrgPositions);
  const qrgOverride = Boolean(candidateInput.specialRule.engineData && candidateInput.specialRule.qrgPositions && !candidateInput.specialRule.cannotAccept);
  const overhangOverride = Boolean(shoring.forwardOverhang?.allowed);
  const baseCap = getUldLimit(candidateInput.pallet, mode.mode, candidateInput.zone);
  const cap = getEffectiveUldLimit(baseCap, candidateInput.specialRule, mode, requiredPositions, p);
  const zoneMax = getZoneMaximum(candidateInput.zone);
  const weightOk = cap !== null && shoring.builtWeight <= cap;
  const uldGrossOk = qrgOverride || !p.uldMaxGross || shoring.builtWeight <= p.uldMaxGross + 0.0001;
  const zoneMaxOk = zoneMax === null || shoring.builtWeight <= zoneMax;
  const lineOk = shoring.lineAfter <= shoring.lineLimit + 0.0001;
  const areaOk = shoring.areaAfter <= shoring.areaLimit + 0.0001;
  const sbsOk = mode.mode !== "sbs" || mode.sbsHeightOk;
  const centerOk = mode.mode !== "center" || mode.centerAllowed;
  const specialModeOk = (!candidateInput.specialRule.requiredMode || mode.mode === candidateInput.specialRule.requiredMode)
    && (!candidateInput.specialRule.allowedModes || candidateInput.specialRule.allowedModes.includes(mode.mode));
  const usableLengthLimit = shoring.forwardOverhang?.applies
    ? p.usableLength + shoring.forwardOverhang.maxIn
    : p.usableLength;
  const usableWidthLimit = contour.centerStructuralCrossload ? p.usableLength : p.usableWidth;
  const usableLengthOk = candidateInput.lengthIn <= usableLengthLimit + 0.0001;
  const usableWidthOk = candidateInput.widthIn <= usableWidthLimit + 0.0001;
  const failures = [];

  if (candidateInput.specialRule.cannotAccept) failures.push("Engine not acceptable");
  if (!doorOk && !qrgOverride && !overhangOverride) failures.push("Door envelope");
  if (!weightOk) failures.push("Weight limit");
  if (!uldGrossOk) failures.push("ULD gross weight");
  if (!zoneMaxOk) failures.push("Zone maximum");
  if (!lineOk) failures.push("Running inch");
  if (!areaOk) failures.push("Area load");
  if (!contour.fits && !qrgOverride && !overhangOverride) failures.push("Hold contour");
  if (shoring.forwardOverhang?.applies && !shoring.forwardOverhang.allowed) failures.push("Forward overhang limit");
  if (!sbsOk && !qrgOverride && !overhangOverride) failures.push("SBS height");
  if (!centerOk) failures.push("Centre load unavailable");
  if (!specialModeOk) failures.push("Special loading rule");
  if (shoring.method.structuralRequired) failures.push("Structural pallet required");

  const footprintPenalty = (usableLengthOk ? 0 : 240) + (usableWidthOk ? 0 : 160);
  const recommendedPenalty = candidateInput.specialRule.recommendedPallet && candidateInput.pallet !== candidateInput.specialRule.recommendedPallet ? 300 : 0;
  const shoringPenalty = shoring.thickness > 0 ? 120 : 0;
  const modePenalty = mode.mode === "center" ? 30 : 0;
  const score = (failures.length * 10000)
    + (requiredPositions * 700)
    + (p.length * 2)
    + p.width
    + footprintPenalty
    + recommendedPenalty
    + shoringPenalty
    + modePenalty;

  return {
    palletKey: candidateInput.pallet,
    pallet: p,
    shoring,
    mode,
    contour,
    requiredPositions,
    failures,
    usableLengthOk,
    usableWidthOk,
    usableLengthLimit,
    usableWidthLimit,
    score,
  };
}

function makeCheck(title, body, state) {
  return `<article class="check ${state}"><strong>${title}</strong><p>${body}</p></article>`;
}

function render() {
  let input = readInputs();
  const checks = [];
  const failures = [];
  const warnings = [];

  if (!input.lengthIn || !input.widthIn || !input.heightIn || !input.weightKg) {
    setDecision("Pending", "Enter cargo details", "neutral");
    document.getElementById("checks").innerHTML = "";
    document.getElementById("buildPlan").innerHTML = "";
    document.getElementById("dataList").innerHTML = "";
    document.getElementById("positionsNeeded").textContent = "-";
    document.getElementById("securing").textContent = "-";
    document.getElementById("builtHeight").textContent = "-";
    document.getElementById("builtWeight").textContent = "-";
    document.getElementById("floorLimit").textContent = "-";
    document.getElementById("specialRule").textContent = "-";
    document.getElementById("beamCount").textContent = "-";
    document.getElementById("deckDiagram").innerHTML = "";
    document.getElementById("contourDiagram").innerHTML = "";
    document.getElementById("shoringDiagram").innerHTML = "";
    return;
  }

  input = resolveAutomatedBuild(input);
  const p = pallets[input.pallet];
  const shoring = calculateShoring(input);
  const requestedMode = input.deckLane === "center" ? "center" : input.specialRule.requiredMode || input.loadMode;
  const mode = resolveMode(requestedMode, input.pallet, input.zone, shoring.builtHeight, Math.min(input.widthIn, p.width));
  const deckLane = selectedDeckLane(input, mode);
  const zoneGroup = selectedZoneGroup(input.zone);
  const baseCap = getUldLimit(input.pallet, mode.mode, input.zone);
  const baseLockLimit = getLockLimit(input.pallet, mode.mode, input.zone);
  const zoneMax = getZoneMaximum(input.zone);
  const positionFamily = selectedPositionFamily(input.zone);
  const contour = resolveHoldContour(input, p, mode, shoring);
  const doorMax = maxDoorLength(input.widthIn, shoring.builtHeight);
  const doorOk = doorMax !== null && input.lengthIn <= doorMax;
  const calculatedPositions = p.positions * input.pieces;
  const qrgPositions = getQrgPositionsForMode(input.specialRule, mode);
  const requiredPositions = Math.max(calculatedPositions, qrgPositions);
  const qrgOverride = Boolean(input.specialRule.engineData && input.specialRule.qrgPositions && !input.specialRule.cannotAccept);
  const overhangOverride = Boolean(shoring.forwardOverhang?.allowed);
  const cap = getEffectiveUldLimit(baseCap, input.specialRule, mode, requiredPositions, p);
  const lockLimit = getEffectiveUldLimit(baseLockLimit, input.specialRule, mode, requiredPositions, p);
  const weightOk = cap !== null && shoring.builtWeight <= cap;
  const uldGrossOk = qrgOverride || !p.uldMaxGross || shoring.builtWeight <= p.uldMaxGross + 0.0001;
  const zoneMaxOk = zoneMax === null || shoring.builtWeight <= zoneMax;
  const rawLineLoad = input.weightKg / input.lengthIn;
  const rawAreaLoad = input.weightKg / ((input.lengthIn * input.widthIn) / 144);
  const lineOk = shoring.lineAfter <= shoring.lineLimit + 0.0001;
  const areaOk = shoring.areaAfter <= shoring.areaLimit + 0.0001;
  const rawLineOk = rawLineLoad <= shoring.lineLimit + 0.0001;
  const rawAreaOk = rawAreaLoad <= shoring.areaLimit + 0.0001;
  const sbsOk = mode.mode !== "sbs" || mode.sbsHeightOk;
  const centerOk = mode.mode !== "center" || mode.centerAllowed;
  const specialModeOk = (!input.specialRule.requiredMode || mode.mode === input.specialRule.requiredMode)
    && (!input.specialRule.allowedModes || input.specialRule.allowedModes.includes(mode.mode));
  const recommendedPalletOk = !input.specialRule.recommendedPallet || input.pallet === input.specialRule.recommendedPallet;

  if (input.specialRule.cannotAccept) failures.push("Engine not acceptable");
  if (!doorOk && !qrgOverride && !overhangOverride) failures.push("Door envelope");
  if (!weightOk) failures.push("Weight limit");
  if (!uldGrossOk) failures.push("ULD gross weight");
  if (!zoneMaxOk) failures.push("Zone maximum");
  if (!lineOk) failures.push("Running inch");
  if (!areaOk) failures.push("Area load");
  if (!contour.fits && !qrgOverride && !overhangOverride) failures.push("Hold contour");
  if (shoring.forwardOverhang?.applies && !shoring.forwardOverhang.allowed) failures.push("Forward overhang limit");
  if (!sbsOk && !qrgOverride && !overhangOverride) failures.push("SBS height");
  if (!centerOk) failures.push("Centre load unavailable");
  if (!specialModeOk) failures.push("Special loading rule");
  if (shoring.method.structuralRequired) failures.push("Structural pallet required");

  const securing = cap === null
    ? "Not allowed"
    : shoring.builtWeight <= lockLimit
      ? "Locks"
      : "Tie-down/straps";

  if (securing !== "Locks" && cap !== null && shoring.builtWeight <= cap) {
    warnings.push("requires tie-down or additional strapping");
  }
  if (shoring.thickness > 0) warnings.push("requires shoring");
  if (!rawLineOk || !rawAreaOk) warnings.push("raw floor load exceeds limits before shoring");
  if (qrgOverride && !sbsOk) warnings.push("QRG SBS height/stand route review");
  if (qrgOverride && !doorOk) warnings.push("QRG door/stand route review");
  if (qrgOverride && !contour.fits) warnings.push("QRG contour/stand review");
  if (qrgOverride && p.uldMaxGross && shoring.builtWeight > p.uldMaxGross) warnings.push("QRG exceeds nominal ULD gross reference");
  if (shoring.forwardOverhang?.allowed) warnings.push("PGE forward overhang build");
  if (overhangOverride && !doorOk) warnings.push("forward overhang door route review");
  if (overhangOverride && !sbsOk) warnings.push("forward overhang raised-height review");
  if (overhangOverride && !contour.fits) warnings.push("forward overhang contour review");
  if (doorOk && doorMax - input.lengthIn <= 6) warnings.push("close to door limit");
  if (requiredPositions > calculatedPositions) warnings.push("special item requires extra positions");
  if (!recommendedPalletOk) warnings.push("special item has a recommended pallet");
  if (input.specialRule.specialPermission) warnings.push("special permission required");
  if (input.pallet === "20ft" && ["D/E", "H/J"].includes(input.zone)) warnings.push("20 foot pallet may lose one adjacent PMC position");
  if (input.pallet === "16ft" && input.pieces >= 3) warnings.push("three 16 foot pallets can be planned as a five-position PRA build");

  checks.push(makeCheck(
    "Door",
    doorMax === null ? "Not loadable through the side cargo door." : `${fmt(input.lengthIn, 1, " in")} cargo length vs ${fmt(doorMax, 0, " in")} door limit.`,
    doorOk ? (doorMax - input.lengthIn <= 6 ? "warn" : "pass") : qrgOverride || overhangOverride ? "warn" : "fail",
  ));
  checks.push(makeCheck(
    "Weight",
    cap === null ? "Selected build is not allowed for this base pallet." : `${fmt(shoring.builtWeight, 0, " kg")} built weight vs ${fmt(cap, 0, " kg")} limit.`,
    weightOk ? (securing === "Locks" ? "pass" : "warn") : "fail",
  ));
  checks.push(makeCheck(
    "ULD Gross",
    p.uldMaxGross ? `${fmt(shoring.builtWeight, 0, " kg")} built weight vs ${fmt(p.uldMaxGross, 0, " kg")} ULD gross reference.` : "No ULD gross reference loaded.",
    uldGrossOk ? qrgOverride && p.uldMaxGross && shoring.builtWeight > p.uldMaxGross ? "warn" : "pass" : "fail",
  ));
  checks.push(makeCheck(
    "Zone Maximum",
    zoneMax === null ? "No zone maximum found for this position." : `${fmt(shoring.builtWeight, 0, " kg")} built weight vs ${fmt(zoneMax, 0, " kg")} zone maximum.`,
    zoneMaxOk ? "pass" : "fail",
  ));
  checks.push(makeCheck(
    "Running Inch",
    `${fmt(rawLineLoad, 1, " kg/in")} raw, ${fmt(shoring.lineAfter, 1, " kg/in")} after shoring vs ${fmt(shoring.lineLimit, 1, " kg/in")} zone limit.`,
    lineOk ? "pass" : "fail",
  ));
  checks.push(makeCheck(
    "Area Load",
    `${fmt(rawAreaLoad, 1, " kg/sq ft")} raw, ${fmt(shoring.areaAfter, 1, " kg/sq ft")} after shoring vs ${fmt(shoring.areaLimit, 0, " kg/sq ft")} limit.`,
    areaOk ? "pass" : "fail",
  ));
  checks.push(makeCheck(
    "Loading",
    mode.mode === "sbs"
      ? `Side by side selected on the ${deckLane} lane; SBS max height is ${fmt(mode.sbsMaxHeight, 1, " in")}.`
      : `Centre load selected; SBS max height is ${fmt(mode.sbsMaxHeight, 1, " in")}.`,
    sbsOk && centerOk ? "pass" : qrgOverride || overhangOverride ? "warn" : "fail",
  ));
  checks.push(makeCheck(
    "Hold Contour",
    `${contour.label}: ${fmt(input.widthIn, 1, " in")} wide x ${fmt(shoring.builtHeight, 1, " in")} high vs ${fmt(contour.widthLimit, 1, " in")} width / ${fmt(contour.maxHeight, 1, " in")} height.`,
    contour.fits ? "pass" : qrgOverride || overhangOverride ? "warn" : "fail",
  ));
  if (shoring.forwardOverhang?.applies) {
    checks.push(makeCheck(
      "Forward Overhang",
      `${fmt(shoring.forwardOverhang.overhangIn, 1, " in")} forward overhang vs ${fmt(shoring.forwardOverhang.maxIn, 1, " in")} / ${forwardOverhangRule.maxCm} cm maximum; build on left side of PGE and raise ${forwardOverhangRule.raiseIn} in.`,
      shoring.forwardOverhang.allowed ? "warn" : "fail",
    ));
  }
  checks.push(makeCheck(
    "Shoring",
    shoring.thickness > 0
      ? `${shoring.method.label}: ${fmt(shoring.thickness, 0, " in")} minimum thickness, ${fmt(shoring.minWidth, 0, " in")} wide x ${fmt(shoring.minLength, 0, " in")} long.`
      : "Not required by CSM linear-load and area-load checks.",
    shoring.thickness > 0 ? "warn" : "pass",
  ));
  checks.push(makeCheck(
    "Shoring Beams",
    shoring.beamPlan.required
      ? `${shoring.beamPlan.baseCount} base beams, ${fmt(shoring.beamPlan.length, 0, " in")} long, approx ${fmt(shoring.beamPlan.spacing, 1, " in")} centre spacing${shoring.beamPlan.crossCount ? `; add ${shoring.beamPlan.crossCount} upper cross beams` : ""}.`
      : "No shoring beams required.",
    shoring.beamPlan.required ? "warn" : "pass",
  ));
  checks.push(makeCheck(
    "CSM Method",
    `${shoring.method.label}. ${shoring.method.description}`,
    shoring.method.structuralRequired ? "fail" : shoring.thickness > 0 ? "warn" : "pass",
  ));
  checks.push(makeCheck(
    "Special Item",
    input.specialRule.key === "none"
      ? "No special-item override selected."
      : `${input.specialRule.label}: ${input.specialRule.note}`,
    input.specialRule.cannotAccept ? "fail" : specialModeOk && recommendedPalletOk && requiredPositions === calculatedPositions && !input.specialRule.specialPermission ? "pass" : "warn",
  ));

  const engineAccepted = Boolean(input.specialRule.engineData && !failures.length);
  const decisionState = failures.length ? "reject" : engineAccepted || !warnings.length ? "accept" : "caution";
  const title = failures.length
    ? "Not acceptable as entered"
    : engineAccepted
      ? "Engine acceptable"
      : warnings.length
      ? "Acceptable with conditions"
      : "Acceptable";
  setDecision(decisionState === "accept" ? "Accept" : decisionState === "caution" ? "Condition" : "Reject", title, decisionState);

  document.getElementById("checks").innerHTML = checks.join("");
  document.getElementById("positionsNeeded").textContent = `${requiredPositions}`;
  document.getElementById("securing").textContent = securing;
  document.getElementById("builtHeight").textContent = fmt(shoring.builtHeight, 1, " in");
  document.getElementById("builtWeight").textContent = fmt(shoring.builtWeight, 0, " kg");
  document.getElementById("floorLimit").textContent = `${fmt(shoring.lineLimit, 1, " kg/in")} / ${fmt(shoring.areaLimit, 0, " kg/sq ft")}`;
  document.getElementById("specialRule").textContent = input.specialRule.key === "none" ? "None" : input.specialRule.label;
  document.getElementById("beamCount").textContent = shoring.beamPlan.required
    ? `${shoring.beamPlan.baseCount}${shoring.beamPlan.crossCount ? ` + ${shoring.beamPlan.crossCount}` : ""}`
    : "0";

  renderBuildPlan(input, p, shoring, mode, securing, doorMax, cap, failures, requiredPositions, calculatedPositions, zoneMax, lockLimit, contour, deckLane);
  renderData(input, p, shoring, mode, doorMax, cap, zoneGroup, rawLineLoad, rawAreaLoad, requiredPositions, zoneMax, lockLimit, positionFamily, contour, deckLane);
  renderDiagrams(input, p, shoring, mode, requiredPositions, zoneGroup, cap, zoneMax, contour);
}

function setDecision(badge, title, state) {
  const status = document.getElementById("overallStatus");
  const decisionBadge = document.getElementById("decisionBadge");
  document.getElementById("decisionTitle").textContent = title;
  status.textContent = badge;
  decisionBadge.textContent = badge;
  status.className = "status-pill";
  decisionBadge.className = "decision-badge";
  if (state) {
    const cls = state === "neutral" ? "" : ` decision-${state}`;
    status.className += cls;
    decisionBadge.className += cls;
  }
}

function renderBuildPlan(input, pallet, shoring, mode, securing, doorMax, cap, failures, requiredPositions, calculatedPositions, zoneMax, lockLimit, contour, deckLane) {
  const plan = [];
  if (input.autoPallet) {
    const rejectedCount = input.autoCandidates?.filter((candidate) => candidate.failures.length).length || 0;
    plan.push(`Auto selected ${pallet.label} because it gives the smallest acceptable ULD/position build for this size and weight${rejectedCount ? `; ${rejectedCount} smaller or alternate option${rejectedCount === 1 ? "" : "s"} did not meet the checks` : ""}.`);
  }
  plan.push(`Build on ${pallet.label} ${pallet.sizeCode}-code base pallet in ${mode.mode === "sbs" ? `${deckLane} side` : "centre-load"} configuration.`);
  const usableText = contour.centerStructuralCrossload
    ? `${pallet.usableLength} in cross-aircraft structural span with ${pallet.usableLength} in fore-aft pallet length`
    : `${pallet.usableWidth} x ${pallet.usableLength} in usable loading area`;
  plan.push(`Use the ${usableText} and ${contour.label} hold contour for the fit check.`);
  if (input.specialRule.key !== "none") {
    plan.push(`${input.specialRule.label}: ${input.specialRule.note}`);
    if (input.specialRule.qrgPositions) {
      const stationSpan = getStationSpanForPositions(input.specialRule, mode, requiredPositions, pallet);
      const laneText = deckLane === "left" ? "left" : deckLane === "center" ? "centre" : "right";
      const stationText = mode.mode === "sbs"
        ? `${stationSpan} adjacent ${laneText} station${stationSpan === 1 ? "" : "s"}`
        : `${stationSpan} centreline station${stationSpan === 1 ? "" : "s"} in the centre row`;
      plan.push(`${requiredPositions} QRG positions means ${stationText}.`);
    }
  }
  plan.push(`Plan ${requiredPositions} main-deck position${requiredPositions === 1 ? "" : "s"} for ${input.pieces} piece${input.pieces === 1 ? "" : "s"}.`);
  if (requiredPositions > calculatedPositions) {
    plan.push(`Reserve ${requiredPositions - calculatedPositions} additional position${requiredPositions - calculatedPositions === 1 ? "" : "s"} for the selected special-item rule.`);
  }
  if (shoring.forwardOverhang?.allowed) {
    plan.push(`Forward overhang build: cargo exceeds the PGE usable length by ${fmt(shoring.forwardOverhang.overhangIn, 1, " in")} (${fmt(shoring.forwardOverhang.overhangIn * 2.54, 0, " cm")}); maximum permitted forward overhang is ${fmt(shoring.forwardOverhang.maxIn, 1, " in")} (${forwardOverhangRule.maxCm} cm).`);
    plan.push(`Build the item on the left side of the PGE pallet and raise the build by ${forwardOverhangRule.raiseIn} in before the fit and door checks.`);
  }
  plan.push(`Apply PDF main-deck limits: ULD limit ${cap === null ? "not allowed" : fmt(cap, 0, " kg")}, lock threshold ${lockLimit === null ? "not allowed" : fmt(lockLimit, 0, " kg")}, selected zone maximum ${zoneMax === null ? "not listed" : fmt(zoneMax, 0, " kg")}.`);
  if (shoring.thickness > 0) {
    plan.push(`${shoring.method.label}: ${shoring.method.description}`);
    plan.push(`Install shoring at least ${fmt(shoring.thickness, 0, " in")} thick, ${fmt(shoring.minWidth, 0, " in")} wide and ${fmt(shoring.minLength, 0, " in")} long; keep shoring beam centres not greater than ${shoringManual.maxBeamSpacing} in.`);
    plan.push(`Use ${shoring.beamPlan.baseCount} base beams, each at least ${fmt(shoring.beamPlan.length, 0, " in")} long, over ${fmt(shoring.beamPlan.coveredLength, 0, " in")} of shoring length with approximately ${fmt(shoring.beamPlan.spacing, 1, " in")} centre spacing.`);
    if (shoring.beamPlan.crossCount) {
      plan.push(`Because the cargo is narrower than the required shoring width or both load limits are exceeded, add ${shoring.beamPlan.crossCount} upper cross beams in the left-right direction, calculated at one beam per ${fmt(shoringManual.crossBeamKg, 0, " kg")} rounded up and no fewer than ${shoringManual.minCrossBeams}.`);
    }
    if (shoring.solidTimberOnly) plan.push("Use solid timber shoring for this thickness requirement.");
    plan.push(`Place beams between roller trays where practicable and keep the cargo centred on the shoring.`);
  } else {
    plan.push("No shoring is required by the CSM linear-load and area-load checks.");
  }
  if (shoring.method.structuralRequired) {
    plan.push(`Use a structural/heavy-duty pallet or obtain an SLR exemption; CSM requires a structural pallet for this selected shoring method or for single heavy pieces of ${fmt(shoringManual.structuralRequiredKg, 0, " kg")} or more.`);
  }
  plan.push(securing === "Locks" ? "Secure by locks." : securing === "Tie-down/straps" ? "Secure by tie-down or additional strapping." : "Selected securing method is not available.");
  if (input.pallet === "20ft" && ["D/E", "H/J"].includes(input.zone)) plan.push("Allow for the possible loss of one adjacent PMC position in this zone.");
  if (input.pallet === "16ft" && input.pieces >= 3) plan.push("For three 16 foot pallets, use the PRA five-position planning pattern from the source workbook.");
  if (input.specialRule.recommendedPallet && input.pallet !== input.specialRule.recommendedPallet) {
    plan.push(`Review base pallet selection; this special item is normally planned on ${pallets[input.specialRule.recommendedPallet].label}.`);
  }
  if (failures.length) plan.push(`Do not accept until corrected: ${failures.join(", ")}.`);

  document.getElementById("buildPlan").innerHTML = plan.map((item) => `<li>${item}</li>`).join("");
}

function renderData(input, pallet, shoring, mode, doorMax, cap, zoneGroup, rawLineLoad, rawAreaLoad, requiredPositions, zoneMax, lockLimit, positionFamily, contour, deckLane) {
  const entries = [
    ["Cargo L x W x H", `${fmt(input.lengthIn, 1, " in")} x ${fmt(input.widthIn, 1, " in")} x ${fmt(input.heightIn, 1, " in")}`],
    ["ULD selection", input.autoPallet ? "Auto selected" : "Manual override"],
    ["Shoring selection", input.extraLayerSelection === "auto" ? "Auto calculated" : `Manual +${input.extraLayerSelection} in`],
    ["Engine stand", input.specialRule.engineData?.stand || "Not selected"],
    ["QRG location", input.specialRule.engineData?.locationText || "Not selected"],
    ["Base pallet", `${pallet.label}, tare ${fmt(pallet.tare, 0, " kg")}`],
    ["Usable area", `${fmt(pallet.usableWidth, 0, " in")} x ${fmt(pallet.usableLength, 0, " in")}`],
    ["ULD gross ref", fmt(pallet.uldMaxGross, 0, " kg")],
    ["Net weight ref", pallet.netWeight],
    ["Zone family", zoneGroup === "wing" ? "F/G/H high-capacity" : "Off-wing / restrictive"],
    ["PDF position family", positionFamily],
    ["Hold contour", contour.label],
    ["Contour limit", `${fmt(contour.widthLimit, 1, " in")} wide / ${fmt(contour.maxHeight, 1, " in")} high`],
    ["Load mode", mode.mode === "sbs" ? "Side by side" : "Centre load"],
    ["Deck lane", deckLane === "center" ? "Centre" : deckLane === "left" ? "Left" : "Right"],
    ["ULD limit", cap === null ? "Not allowed" : fmt(cap, 0, " kg")],
    ["Lock threshold", lockLimit === null ? "Not allowed" : fmt(lockLimit, 0, " kg")],
    ["Zone maximum", zoneMax === null ? "Not listed" : fmt(zoneMax, 0, " kg")],
    ["Door max length", doorMax === null ? "Not loadable" : fmt(doorMax, 0, " in")],
    ["Positions required", `${requiredPositions}`],
    ["QRG meaning", describeQrgMeaning(input.specialRule, mode, requiredPositions, pallet, deckLane)],
    ["Forward overhang", shoring.forwardOverhang?.applies ? `${fmt(shoring.forwardOverhang.overhangIn, 1, " in")} / max ${fmt(shoring.forwardOverhang.maxIn, 1, " in")}` : "None"],
    ["Overhang raise", shoring.forwardOverhang?.allowed ? `${forwardOverhangRule.raiseIn} in` : "None"],
    ["Raw floor load", `${fmt(rawLineLoad, 1, " kg/in")} / ${fmt(rawAreaLoad, 1, " kg/sq ft")}`],
    ["After shoring", `${fmt(shoring.lineAfter, 1, " kg/in")} / ${fmt(shoring.areaAfter, 1, " kg/sq ft")}`],
    ["Shoring method", shoring.method.label],
    ["Method source", shoringManual.source],
    ["Pallet structure", pallet.structural ? "Structural/heavy-duty" : "Non-structural/flexible"],
    ["Required spread", `${fmt(shoring.spreadLength, 1, " in")} length / ${fmt(shoring.spreadWidth, 1, " in")} width`],
    ["Shoring beams", shoring.beamPlan.required ? `${shoring.beamPlan.baseCount} base at ${fmt(shoring.beamPlan.spacing, 1, " in")} c/c` : "None"],
    ["Upper cross beams", shoring.beamPlan.crossCount ? `${shoring.beamPlan.crossCount}` : "None"],
    ["Beam length", shoring.beamPlan.required ? fmt(shoring.beamPlan.length, 0, " in") : "None"],
    ["Beam min thickness", shoring.thickness > 0 ? fmt(shoring.thickness, 0, " in") : "None"],
    ["Shoring weight", fmt(shoring.shoringWeight, 0, " kg")],
    ["Pallet height add", fmt(shoring.palletHeight, 0, " in")],
    ["Special item", input.specialRule.key === "none" ? "None" : input.specialRule.label],
    ["Limit source", "EY572/GRH/Rev.1 Apr. 2026 + GOM ULD/Hold pages 52, 65-66"],
  ];
  document.getElementById("dataList").innerHTML = entries
    .map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`)
    .join("");
}

function renderDiagrams(input, pallet, shoring, mode, requiredPositions, zoneGroup, cap, zoneMax, contour) {
  document.getElementById("deckDiagram").innerHTML = buildDeckDiagram(input, pallet, mode, requiredPositions, zoneGroup, cap, zoneMax, contour, shoring);
  document.getElementById("contourDiagram").innerHTML = buildHoldContourDiagram(input, pallet, shoring, mode, contour);
  document.getElementById("shoringDiagram").innerHTML = buildShoringDiagram(input, shoring);
}

function buildDeckDiagram(input, pallet, mode, requiredPositions, zoneGroup, cap, zoneMax, contour, shoring) {
  const positions = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "P"];
  const sidePositions = [...positions, "R"];
  const selected = input.zone.split("/").filter(Boolean);
  const deckLane = selectedDeckLane(input, mode);
  const primaryPosition = selected[0] || "F";
  const canUseR = deckLane !== "center";
  const lanePositions = canUseR && primaryPosition === "R" ? sidePositions : positions;
  const qrgStationSpan = input.specialRule.qrgPositions ? getStationSpanForPositions(input.specialRule, mode, requiredPositions, pallet) : null;
  const visualSpan = primaryPosition === "R" ? 1 : qrgStationSpan || (pallet.length > 130 ? 2 : 1);
  const reserveSpan = primaryPosition === "R" ? 1 : Math.max(visualSpan, Math.min(qrgStationSpan || requiredPositions, lanePositions.length));
  const primaryIndex = Math.max(0, lanePositions.indexOf(primaryPosition) === -1 ? positions.indexOf(primaryPosition) : lanePositions.indexOf(primaryPosition));
  const startIndex = Math.min(Math.max(0, primaryIndex), lanePositions.length - visualSpan);
  const reserveStart = Math.min(Math.max(0, primaryIndex), lanePositions.length - reserveSpan);
  const cellW = 83;
  const rW = 82;
  const headerH = 26;
  const sideLaneH = 104;
  const centerBodyH = 104;
  const footerH = 26;
  const x0 = 6;
  const ySide = 10;
  const yCenter = 322;
  const sideWidth = positions.length * cellW;
  const rX = x0 + sideWidth;
  const rY = ySide + 52;
  const bodyRightY = ySide + headerH;
  const bodyLeftY = bodyRightY + sideLaneH;
  const footerY = bodyLeftY + sideLaneH;
  const centerBodyY = yCenter + headerH;
  const cellX = (position) => position === "R" ? rX : x0 + (positions.indexOf(position) * cellW);
  const cellWidth = (position) => position === "R" ? rW : cellW;
  const rowY = deckLane === "center" ? centerBodyY : deckLane === "left" ? bodyLeftY : bodyRightY;
  const rowH = deckLane === "center" ? centerBodyH : sideLaneH;
  const selectedStart = lanePositions[startIndex] || "F";
  const selectedEnd = lanePositions[startIndex + visualSpan - 1] || selectedStart;
  const reserveStartPosition = lanePositions[reserveStart] || selectedStart;
  const reserveEndPosition = lanePositions[reserveStart + reserveSpan - 1] || selectedEnd;
  const selectedX = cellX(selectedStart);
  const selectedW = (cellX(selectedEnd) + cellWidth(selectedEnd)) - selectedX;
  const reserveX = cellX(reserveStartPosition);
  const reserveW = (cellX(reserveEndPosition) + cellWidth(reserveEndPosition)) - reserveX;
  const itemColor = contour.fits ? "#8bcf4f" : "#f2685b";
  const itemStroke = contour.fits ? "#527d1f" : "#9d241a";
  const laneLabel = deckLane === "center" ? "CENTRE" : deckLane.toUpperCase();
  const fullWidth = rX + rW + 8;
  const drawLabelCells = (y, suffix) => positions.map((position) => `
    <rect x="${cellX(position)}" y="${y}" width="${cellW}" height="${headerH}" fill="#ffffff" stroke="#111" stroke-width="1"/>
    <text x="${cellX(position) + cellW / 2}" y="${y + 18}" text-anchor="middle" fill="#000" font-family="Arial" font-size="14" font-weight="700">${position}${suffix}</text>
  `).join("");
  const drawBodyCells = (y, h) => positions.map((position) => `
    <rect x="${cellX(position)}" y="${y}" width="${cellW}" height="${h}" fill="#ffffff" stroke="#111" stroke-width="1"/>
  `).join("");
  const reserveOverlay = (targetY) => requiredPositions > visualSpan && primaryPosition !== "R" ? `
    <rect x="${reserveX}" y="${targetY + 4}" width="${reserveW}" height="${rowH - 8}" fill="#dfeaff" stroke="#3a66b7" stroke-width="2" stroke-dasharray="8 5" opacity="0.75"/>
    <text x="${reserveX + reserveW / 2}" y="${targetY + rowH - 12}" text-anchor="middle" fill="#254b92" font-family="Arial" font-size="12" font-weight="700">RESERVE ${requiredPositions} POSITIONS</text>
  ` : "";
  const drawLoadOverlay = (targetY, targetLaneLabel) => {
    const stationLengthIn = 125;
    const stationSpanIn = Math.max(stationLengthIn, visualSpan * stationLengthIn);
    const scaleX = (selectedW - 10) / stationSpanIn;
    const laneWidthIn = deckLane === "center" ? 192 : 96;
    const scaleY = (rowH - 16) / laneWidthIn;
    const palletW = selectedW - 10;
    const palletX = selectedX + 5;
    const overhangW = shoring.forwardOverhang?.applies
      ? Math.max(0, shoring.forwardOverhang.overhangIn * scaleX)
      : 0;
    const itemW = Math.max(16, input.lengthIn * scaleX);
    const palletH = Math.min(rowH - 16, Math.max(18, pallet.width * scaleY));
    const itemH = Math.max(14, Math.min(rowH - 10, input.widthIn * scaleY));
    const itemX = shoring.forwardOverhang?.applies
      ? palletX - overhangW
      : palletX + (palletW - Math.min(itemW, palletW)) / 2;
    const itemDrawX = Math.max(x0 + 2, itemX);
    const itemDrawW = Math.min(itemX + itemW, rX + rW - 2) - itemDrawX;
    const overhangX = Math.max(x0 + 2, itemX);
    const overhangDrawW = Math.max(0, Math.min(palletX, rX + rW - 2) - overhangX);
    const previousPosition = lanePositions[startIndex - 1];
    const vacantX = previousPosition ? cellX(previousPosition) : null;
    const vacantW = previousPosition ? cellWidth(previousPosition) : null;
    const palletY = targetY + (rowH - palletH) / 2;
    const itemY = palletY + (palletH - itemH) / 2;
    const overhangFill = shoring.forwardOverhang.allowed ? "#fff3cf" : "#fde7e5";
    const overhangStroke = shoring.forwardOverhang.allowed ? "#b7791f" : "#b42318";
    const hatchLines = Array.from({ length: Math.ceil(overhangDrawW / 10) + 2 }, (_, index) => {
      const x = overhangX - itemH + (index * 10);
      return `<line x1="${x}" y1="${itemY + itemH}" x2="${x + itemH}" y2="${itemY}" stroke="${overhangStroke}" stroke-width="1" opacity="0.5"/>`;
    }).join("");
    const vacantOverlay = shoring.forwardOverhang?.applies && vacantX !== null ? `
      <rect x="${vacantX + 4}" y="${targetY + 5}" width="${vacantW - 8}" height="${rowH - 10}" fill="#fff8e6" stroke="#b7791f" stroke-width="1.5" stroke-dasharray="6 5"/>
      <text x="${vacantX + vacantW / 2}" y="${targetY + rowH - 12}" text-anchor="middle" fill="#8a4f08" font-family="Arial" font-size="11" font-weight="700">FWD SPACE</text>
    ` : "";
    const overhangOverlay = shoring.forwardOverhang?.applies && overhangDrawW > 0 ? `
      <clipPath id="overhangClip-${targetLaneLabel}"><rect x="${overhangX}" y="${itemY}" width="${overhangDrawW}" height="${itemH}"/></clipPath>
      <rect x="${overhangX}" y="${itemY}" width="${overhangDrawW}" height="${itemH}" fill="${overhangFill}" stroke="${overhangStroke}" stroke-width="2" stroke-dasharray="7 4"/>
      <g clip-path="url(#overhangClip-${targetLaneLabel})">${hatchLines}</g>
      <line x1="${overhangX + overhangDrawW / 2}" y1="${itemY - 2}" x2="${vacantX !== null ? vacantX + vacantW / 2 : overhangX + overhangDrawW / 2}" y2="${targetY + 22}" stroke="${overhangStroke}" stroke-width="1.5"/>
      <text x="${vacantX !== null ? vacantX + vacantW / 2 : overhangX + overhangDrawW / 2}" y="${targetY + 23}" text-anchor="middle" fill="${overhangStroke}" font-family="Arial" font-size="18" font-weight="500">OHG</text>
      <text x="${vacantX !== null ? vacantX + vacantW / 2 : overhangX + overhangDrawW / 2}" y="${targetY + 39}" text-anchor="middle" fill="${overhangStroke}" font-family="Arial" font-size="10">${fmt(shoring.forwardOverhang.overhangIn, 1, " in")} / ${fmt(shoring.forwardOverhang.overhangIn * 2.54, 0, " cm")}</text>
    ` : "";
    const itemTextX = Math.max(selectedX + 38, Math.min(selectedX + selectedW - 38, itemDrawX + itemDrawW / 2));
    const itemLabel = `${pallet.code} - ${input.pieces} pc`;
    const palletLabelSize = palletW > 150 ? 24 : 18;
    const itemOverlay = shoring.forwardOverhang?.applies ? `
      <rect x="${itemDrawX}" y="${itemY}" width="${Math.max(8, itemDrawW)}" height="${itemH}" fill="#dff2e6" fill-opacity="0.95" stroke="${itemStroke}" stroke-width="2.4"/>
      ${overhangOverlay}
      <text x="${itemTextX}" y="${itemY - 6}" text-anchor="middle" fill="#34444d" font-family="Arial" font-size="10">${fmt(input.lengthIn, 1, " in")} x ${fmt(input.widthIn, 1, " in")} x ${fmt(shoring.builtHeight, 1, " in")}</text>
      <text x="${itemTextX}" y="${itemY + Math.max(17, itemH / 2 - 5)}" text-anchor="middle" fill="#000" font-family="Arial" font-size="14" font-weight="700">${itemLabel}</text>
      <text x="${itemTextX}" y="${itemY + Math.max(34, itemH / 2 + 12)}" text-anchor="middle" fill="#000" font-family="Arial" font-size="12" font-weight="700">${targetLaneLabel} ${input.zone}</text>
    ` : "";

    return `
      <g>
        ${reserveOverlay(targetY)}
        ${vacantOverlay}
        <rect x="${palletX}" y="${palletY}" width="${palletW}" height="${palletH}" fill="#92d050" stroke="#111" stroke-width="2"/>
        <text x="${palletX + palletW / 2}" y="${palletY + Math.max(28, palletH / 2 - 4)}" text-anchor="middle" fill="#000" font-family="Arial" font-size="${palletLabelSize}" font-weight="500">${pallet.code}</text>
        ${itemOverlay}
      </g>
    `;
  };
  const loadOverlay = drawLoadOverlay(rowY, laneLabel);

  return `
    <svg viewBox="0 0 1180 470" role="img" aria-label="B777F main deck grid showing right, left, centre positions and selected ULD footprint">
      <rect x="0" y="0" width="1180" height="470" fill="#ffffff"/>
      ${drawLabelCells(ySide, "R")}
      ${drawBodyCells(bodyRightY, sideLaneH)}
      ${drawBodyCells(bodyLeftY, sideLaneH)}
      ${drawLabelCells(footerY, "L")}
      <rect x="${rX}" y="${rY}" width="${rW}" height="${headerH}" fill="#ffffff" stroke="#111" stroke-width="1"/>
      <text x="${rX + rW / 2}" y="${rY + 18}" text-anchor="middle" fill="#000" font-family="Arial" font-size="14" font-weight="700">R</text>
      <rect x="${rX}" y="${rY + headerH}" width="${rW}" height="${sideLaneH + 26}" fill="#ffffff" stroke="#111" stroke-width="1"/>
      ${drawLabelCells(yCenter, "C")}
      ${drawBodyCells(centerBodyY, centerBodyH)}
      ${loadOverlay}
      <text x="8" y="304" class="svg-small">${pallet.code} visual span: ${visualSpan} position${visualSpan === 1 ? "" : "s"} | selected lane ${laneLabel} | required ${requiredPositions} position${requiredPositions === 1 ? "" : "s"}${shoring.forwardOverhang?.applies ? ` | forward overhang ${fmt(shoring.forwardOverhang.overhangIn, 1, " in")} / ${fmt(shoring.forwardOverhang.overhangIn * 2.54, 0, " cm")}` : ""}</text>
    </svg>
  `;
}

function buildContourInset(input, shoring, contour, x = 540, y = 48, panelW = 206, panelH = 154) {
  const baseW = panelW - 52;
  const baseY = y + panelH - 52;
  const heightPx = panelH - 74;
  const profileW = Math.max(contour.widthLimit, input.widthIn, 1);
  const profileH = Math.max(contour.maxHeight, shoring.builtHeight, 1);
  const itemW = Math.min(baseW, (input.widthIn / profileW) * baseW);
  const itemH = Math.min(heightPx, (shoring.builtHeight / profileH) * heightPx);
  const topW = Math.max(18, (contour.topWidth / profileW) * baseW);
  const plotX = x + 26;
  const itemX = plotX + (baseW - itemW) / 2;
  const itemY = baseY - itemH;
  const shoulderY = baseY - (heightPx * 0.82);
  const statusColor = contour.fits ? "#177245" : "#b42318";
  const shape = [
    `${plotX},${baseY}`,
    `${plotX},${baseY - heightPx * 0.42}`,
    `${plotX + (baseW - topW) / 2},${shoulderY}`,
    `${plotX + (baseW - topW) / 2 + topW},${shoulderY}`,
    `${plotX + baseW},${baseY - heightPx * 0.42}`,
    `${plotX + baseW},${baseY}`,
  ].join(" ");

  return `
    <g>
      <rect x="${x}" y="${y}" width="${panelW}" height="${panelH}" rx="8" fill="#f8fafb" stroke="#d9e0e4"/>
      <text x="${x + 14}" y="${y + 24}" class="svg-label">HOLD CONTOUR</text>
      <polyline points="${shape}" fill="#edf2f4" stroke="#7c8587" stroke-width="1.5"/>
      <line x1="${plotX}" y1="${baseY}" x2="${plotX + baseW}" y2="${baseY}" stroke="#39464d" stroke-width="2"/>
      <rect x="${itemX}" y="${itemY}" width="${itemW}" height="${itemH}" fill="${statusColor}" opacity="0.78" stroke="#1f2933" stroke-width="1.4"/>
      <text x="${x + panelW / 2}" y="${baseY + 20}" text-anchor="middle" class="svg-small">${fmt(input.widthIn, 1, " in")} W x ${fmt(shoring.builtHeight, 1, " in")} H</text>
      <text x="${x + panelW / 2}" y="${baseY + 36}" text-anchor="middle" class="svg-small">${contour.fits ? "INSIDE PROFILE" : "OUTSIDE PROFILE"}</text>
    </g>
  `;
}

function buildHoldContourDiagram(input, pallet, shoring, mode, contour) {
  const deckLane = selectedDeckLane(input, mode);
  const centerLoad = mode.mode === "center";
  const laneText = centerLoad ? "CENTRE LOAD" : `${deckLane.toUpperCase()} SIDE POSITION`;
  const isEngine = Boolean(input.specialRule.engineData);
  const qrgEngineEnvelope = Boolean(isEngine && input.specialRule.qrgPositions);
  const itemWidth = input.widthIn;
  const builtHeight = shoring.builtHeight;
  const supportHeight = Math.max(0, shoring.thickness + shoring.palletHeight + input.extraLayer);
  const cargoHeight = Math.max(0, input.heightIn);
  const deckWidthIn = 192;
  const sideWidthIn = deckWidthIn / 2;
  const profileHeightLimit = contour.maxHeight || 118;
  const maxDrawHeight = Math.max(profileHeightLimit, builtHeight, 118);
  const canvasW = 960;
  const canvasH = 450;
  const plotW = 690;
  const plotH = 285;
  const scale = Math.min(plotW / (deckWidthIn * 1.16), plotH / (maxDrawHeight * 1.16));
  const centerX = 540;
  const baseY = 340;
  const deckW = deckWidthIn * scale;
  const deckLeft = centerX - deckW / 2;
  const deckRight = centerX + deckW / 2;
  const sideW = sideWidthIn * scale;
  const profileH = profileHeightLimit * scale;
  const topY = baseY - profileH;
  const shellTopY = topY - Math.max(28, profileH * 0.1);
  const shoulderY = baseY - profileH * 0.72;
  const topHalf = Math.min(deckW * 0.36, Math.max(42, (contour.topWidth || 48) * scale));
  const aircraftPath = [
    `M ${deckLeft - 28} ${baseY}`,
    `C ${deckLeft - 26} ${shoulderY}, ${centerX - deckW * 0.36} ${shellTopY}, ${centerX} ${shellTopY}`,
    `C ${centerX + deckW * 0.36} ${shellTopY}, ${deckRight + 26} ${shoulderY}, ${deckRight + 28} ${baseY}`,
    `L ${deckLeft - 28} ${baseY}`,
    "Z",
  ].join(" ");
  const usablePath = [
    `M ${deckLeft} ${baseY}`,
    `L ${deckLeft} ${baseY - profileH * 0.58}`,
    `L ${centerX - topHalf} ${topY}`,
    `L ${centerX + topHalf} ${topY}`,
    `L ${deckRight} ${baseY - profileH * 0.58}`,
    `L ${deckRight} ${baseY}`,
    "Z",
  ].join(" ");
  const itemW = itemWidth * scale;
  const itemH = builtHeight * scale;
  const supportH = supportHeight * scale;
  const cargoH = Math.max(0, cargoHeight * scale);
  const itemCenterX = centerLoad
    ? centerX
    : deckLane === "left"
      ? deckLeft + sideW / 2
      : deckRight - sideW / 2;
  const itemX = itemCenterX - itemW / 2;
  const itemY = baseY - itemH;
  const supportY = baseY - supportH;
  const cargoY = supportH > 0 ? Math.max(itemY, supportY - cargoH) : itemY;
  const cargoDrawH = supportH > 0 ? Math.max(6, baseY - supportH - cargoY) : itemH;
  const visualFits = qrgEngineEnvelope || contour.fits;
  const fitColor = visualFits ? "#177245" : "#b42318";
  const itemFill = visualFits ? "#dff2e6" : "#fde7e5";
  const selectedLaneX = centerLoad ? itemCenterX - Math.max(itemW, sideW) / 2 : deckLane === "left" ? deckLeft : deckRight - sideW;
  const selectedLaneW = centerLoad ? Math.max(itemW, sideW) : sideW;
  const selectedLaneLabel = centerLoad ? "CENTRE" : deckLane.toUpperCase();
  const baseBandY = baseY - Math.max(10, Math.min(18, 8 * scale));
  const baseBandH = baseY - baseBandY;
  const dimensionX = Math.min(canvasW - 58, itemX + itemW + 28);
  const topDimensionY = Math.max(48, itemY - 20);
  const deckDimensionY = baseY + 72;
  const supportLayer = supportH > 0 ? `
    <rect x="${itemX}" y="${supportY}" width="${itemW}" height="${supportH}" fill="#b8874f" stroke="#7c552c" stroke-width="1.4"/>
    <text x="${itemCenterX}" y="${supportY + Math.max(12, supportH / 2 + 4)}" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="11" font-weight="700">BASE / SHORING</text>
  ` : "";
  const cargoLayer = isEngine
    ? buildEngineContourShape({
      cx: itemCenterX,
      cy: cargoY + cargoDrawH / 2,
      rx: Math.max(16, itemW / 2),
      ry: Math.max(16, cargoDrawH / 2),
      fill: itemFill,
      stroke: fitColor,
      label: input.specialRule.manufacturer || "ENGINE",
    })
    : `
      <rect x="${itemX}" y="${cargoY}" width="${itemW}" height="${cargoDrawH}" fill="${itemFill}" stroke="${fitColor}" stroke-width="2.2"/>
      <text x="${itemCenterX}" y="${cargoY + Math.max(18, cargoDrawH / 2)}" text-anchor="middle" fill="#172026" font-family="Arial" font-size="15" font-weight="700">ITEM</text>
    `;
  const itemDimensionLayer = `
    ${svgDimensionLine(itemX, topDimensionY, itemX + itemW, topDimensionY, `${fmt(itemWidth, 1, " in")} item width`)}
    ${svgVerticalDimension(dimensionX, itemY, baseY, `${fmt(builtHeight, 1, " in")} built height`)}
  `;

  return `
    <svg viewBox="0 0 ${canvasW} ${canvasH}" role="img" aria-label="Hold contour image for ${laneText.toLowerCase()}">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill="#39464d"/>
        </marker>
      </defs>
      <rect x="0" y="0" width="${canvasW}" height="${canvasH}" fill="#ffffff"/>
      <text x="38" y="46" class="svg-label">HOLD CONTOUR</text>
      <text x="38" y="72" class="svg-value">${laneText}</text>
      <text x="38" y="98" class="svg-small">${contour.label}</text>
      <path d="${aircraftPath}" fill="#eef3f5" stroke="#9aa4aa" stroke-width="2.4"/>
      <path d="${usablePath}" fill="#dfe6ea" stroke="#263238" stroke-width="2.2"/>
      <rect x="${selectedLaneX}" y="${baseBandY}" width="${selectedLaneW}" height="${baseBandH}" fill="#c9d4db" opacity="0.95"/>
      <line x1="${deckLeft - 32}" y1="${baseY}" x2="${deckRight + 32}" y2="${baseY}" stroke="#263238" stroke-width="2.2"/>
      <text x="${deckLeft + sideW / 2}" y="${baseY + 28}" text-anchor="middle" class="svg-value">LEFT</text>
      <text x="${deckRight - sideW / 2}" y="${baseY + 28}" text-anchor="middle" class="svg-value">RIGHT</text>
      <text x="${itemCenterX}" y="${baseY + 51}" text-anchor="middle" class="svg-small">${pallet.code} / ${selectedLaneLabel} LOAD FOOTPRINT</text>
      ${svgDimensionLine(deckLeft, deckDimensionY, deckRight, deckDimensionY, `${fmt(deckWidthIn, 0, " in")} hold width`, "bottom")}
      ${svgVerticalDimension(deckLeft - 42, topY, baseY, `${fmt(profileHeightLimit, 0, " in")} contour height`)}
      ${cargoLayer}
      ${supportLayer}
      ${itemDimensionLayer}
      <text x="38" y="350" class="svg-label">STATUS</text>
      <text x="98" y="350" fill="${fitColor}" font-family="Arial" font-size="15" font-weight="700">${visualFits ? "INSIDE CONTOUR" : "OUTSIDE CONTOUR"}</text>
      <text x="38" y="374" class="svg-small">${pallet.code} | ${fmt(input.lengthIn, 1, " in")} L x ${fmt(input.widthIn, 1, " in")} W x ${fmt(input.heightIn, 1, " in")} H | ${isEngine ? "engine cylinder envelope shown" : supportHeight > 0 ? `${fmt(supportHeight, 1, " in")} base/shoring height shown` : "no shoring/base layer shown"}</text>
    </svg>
  `;
}

function buildEngineContourShape({ cx, cy, rx, ry, fill, stroke, label }) {
  const engineLabel = label && label !== "ENGINE" ? `${label} ENGINE` : "ENGINE";

  return `
    <g>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="2.4"/>
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="#172026" font-family="Arial" font-size="13" font-weight="700">${engineLabel}</text>
    </g>
  `;
}

function svgDimensionLine(x1, y1, x2, y2, label, labelSide = "top") {
  const labelY = labelSide === "bottom" ? y1 + 18 : y1 - 8;
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#39464d" stroke-width="1.2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
    <line x1="${x1}" y1="${y1 - 8}" x2="${x1}" y2="${y1 + 8}" stroke="#39464d" stroke-width="1"/>
    <line x1="${x2}" y1="${y2 - 8}" x2="${x2}" y2="${y2 + 8}" stroke="#39464d" stroke-width="1"/>
    <text x="${(x1 + x2) / 2}" y="${labelY}" text-anchor="middle" class="svg-small">${label}</text>
  `;
}

function svgVerticalDimension(x, y1, y2, label) {
  return `
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#39464d" stroke-width="1.2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
    <line x1="${x - 8}" y1="${y1}" x2="${x + 8}" y2="${y1}" stroke="#39464d" stroke-width="1"/>
    <line x1="${x - 8}" y1="${y2}" x2="${x + 8}" y2="${y2}" stroke="#39464d" stroke-width="1"/>
    <text x="${x - 12}" y="${(y1 + y2) / 2}" text-anchor="middle" class="svg-small" transform="rotate(-90 ${x - 12} ${(y1 + y2) / 2})">${label}</text>
  `;
}

function buildSelectedUldPanel(input, pallet, shoring, contour, x, y, panelW, panelH) {
  const pad = 22;
  const uldX = x + pad;
  const uldY = y + 48;
  const uldW = panelW - (pad * 2);
  const uldH = 86;
  const itemW = Math.max(22, Math.min(uldW - 16, (input.lengthIn / Math.max(pallet.usableLength, 1)) * (uldW - 16)));
  const itemH = Math.max(16, Math.min(uldH - 16, (input.widthIn / Math.max(pallet.usableWidth, 1)) * (uldH - 16)));
  const itemX = uldX + (uldW - itemW) / 2;
  const itemY = uldY + (uldH - itemH) / 2;
  const itemColor = contour.fits ? "#8bcf4f" : "#f2685b";
  return `
    <g>
      <rect x="${x}" y="${y}" width="${panelW}" height="${panelH}" rx="8" fill="#f8fafb" stroke="#d9e0e4"/>
      <text x="${x + 14}" y="${y + 24}" class="svg-label">SELECTED ULD</text>
      <text x="${x + 14}" y="${y + 42}" class="svg-small">${pallet.code} usable ${fmt(pallet.usableWidth, 0, " in")} x ${fmt(pallet.usableLength, 0, " in")}</text>
      <rect x="${uldX}" y="${uldY}" width="${uldW}" height="${uldH}" fill="#ffffff" stroke="#111" stroke-width="2"/>
      <rect x="${itemX}" y="${itemY}" width="${itemW}" height="${itemH}" fill="${itemColor}" stroke="#1f2933" stroke-width="2"/>
      <line x1="${uldX + uldW / 2}" y1="${uldY}" x2="${uldX + uldW / 2}" y2="${uldY + uldH}" stroke="#9aa4aa" stroke-dasharray="5 4"/>
      <line x1="${uldX}" y1="${uldY + uldH / 2}" x2="${uldX + uldW}" y2="${uldY + uldH / 2}" stroke="#9aa4aa" stroke-dasharray="5 4"/>
      <text x="${x + panelW / 2}" y="${y + panelH - 44}" text-anchor="middle" class="svg-small">ITEM FOOTPRINT CENTRED</text>
      <text x="${x + panelW / 2}" y="${y + panelH - 25}" text-anchor="middle" class="svg-small">${fmt(input.weightKg, 0, " kg")} cargo / ${fmt(shoring.builtWeight, 0, " kg")} built</text>
    </g>
  `;
}

function buildShoringDiagram(input, shoring) {
  const beam = shoring.beamPlan;
  const canvasW = 680;
  const canvasH = 300;
  const scale = beam.required ? Math.min(2.25, 430 / Math.max(beam.coveredLength, beam.length, 1)) : 1;
  const matW = beam.required ? Math.max(140, beam.coveredLength * scale) : 250;
  const matH = beam.required ? Math.max(90, beam.length * scale) : 120;
  const matX = (canvasW - matW) / 2;
  const matY = 76;
  const cargoW = Math.min(matW - 24, Math.max(70, input.lengthIn * scale));
  const cargoH = Math.min(matH - 24, Math.max(42, input.widthIn * scale));
  const cargoX = matX + (matW - cargoW) / 2;
  const cargoY = matY + (matH - cargoH) / 2;

  const beams = beam.required
    ? Array.from({ length: beam.baseCount }, (_, index) => {
      const x = matX + (index * (matW / (beam.baseCount - 1)));
      return `
        <rect x="${x - 3}" y="${matY}" width="6" height="${matH}" fill="#6f5133"/>
        <text x="${x}" y="${matY + matH + 17}" text-anchor="middle" class="svg-small">${index + 1}</text>
      `;
    }).join("")
    : "";
  const crossBeams = beam.required && beam.crossCount
    ? Array.from({ length: beam.crossCount }, (_, index) => {
      const y = cargoY + 8 + (index * ((cargoH - 16) / Math.max(1, beam.crossCount - 1)));
      return `<rect x="${cargoX - 12}" y="${y - 3}" width="${cargoW + 24}" height="6" fill="#b8874f" stroke="#6f5133" stroke-width="0.8"/>`;
    }).join("")
    : "";

  const empty = beam.required ? "" : `
    <text x="${canvasW / 2}" y="148" text-anchor="middle" class="svg-value">No shoring beams required</text>
  `;

  return `
    <svg viewBox="0 0 ${canvasW} ${canvasH}" role="img" aria-label="Shoring beam build image">
      <rect x="24" y="24" width="632" height="250" rx="12" fill="#ffffff" stroke="#d9e0e4"/>
      <text x="42" y="50" class="svg-label">SHORING BUILD</text>
      <rect x="${matX}" y="${matY}" width="${matW}" height="${matH}" rx="6" fill="#e7d5b7" stroke="#9a7a4f" stroke-width="2"/>
      ${beams}
      ${crossBeams}
      <rect x="${cargoX}" y="${cargoY}" width="${cargoW}" height="${cargoH}" rx="6" fill="#1d5f8f" opacity="0.82"/>
      <text x="${cargoX + cargoW / 2}" y="${cargoY + cargoH / 2 + 5}" text-anchor="middle" fill="#ffffff" font-family="Arial" font-weight="700" font-size="13">ITEM FOOTPRINT</text>
      ${empty}
      <text x="42" y="246" class="svg-label">BEAMS</text>
      <text x="100" y="246" class="svg-value">${beam.baseCount}</text>
      <text x="166" y="246" class="svg-label">C/C</text>
      <text x="206" y="246" class="svg-value">${beam.required ? fmt(beam.spacing, 1, " in") : "-"}</text>
      <text x="300" y="246" class="svg-label">BEAM LENGTH</text>
      <text x="410" y="246" class="svg-value">${beam.required ? fmt(beam.length, 0, " in") : "-"}</text>
      <text x="520" y="246" class="svg-label">CROSS</text>
      <text x="582" y="246" class="svg-value">${beam.crossCount || "-"}</text>
      <text x="42" y="268" class="svg-label">METHOD</text>
      <text x="110" y="268" class="svg-value">${shoring.method.label}</text>
      <text x="430" y="268" class="svg-label">THICKNESS</text>
      <text x="520" y="268" class="svg-value">${shoring.thickness > 0 ? fmt(shoring.thickness, 0, " in") : "-"}</text>
    </svg>
  `;
}

function resetPlanner() {
  document.getElementById("unitCm").checked = true;
  document.getElementById("unitIn").checked = false;
  ["length", "width", "height", "weight"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("pieces").value = 1;
  document.getElementById("specialItem").value = "none";
  document.getElementById("pallet").value = "auto";
  document.getElementById("zone").value = "F";
  document.getElementById("deckLane").value = "auto";
  document.getElementById("loadMode").value = "auto";
  document.getElementById("extraLayer").value = "auto";
  document.getElementById("customMinPositions").value = 0;
  document.getElementById("customRequiredMode").value = "none";
  document.querySelectorAll(".custom-rule").forEach((field) => {
    field.hidden = true;
  });
  render();
}

function init() {
  const zoneSelect = document.getElementById("zone");
  zoneSelect.innerHTML = zones.map(([name]) => `<option value="${name}">${name}</option>`).join("");
  zoneSelect.value = "F";
  const specialSelect = document.getElementById("specialItem");
  let applyingSpecialPreset = false;
  specialSelect.innerHTML = Object.entries(specialItems)
    .map(([key, item]) => `<option value="${key}">${item.label}</option>`)
    .join("");
  specialSelect.value = "none";
  specialSelect.addEventListener("change", () => {
    const rule = getSpecialRule();
    if (rule.engineData) {
      applyingSpecialPreset = true;
      document.getElementById("unitCm").checked = true;
      document.getElementById("length").value = rule.engineData.length;
      document.getElementById("width").value = rule.engineData.width;
      document.getElementById("height").value = rule.engineData.height;
      document.getElementById("weight").value = rule.engineData.weight;
      document.getElementById("pieces").value = 1;
      document.getElementById("pallet").value = "auto";
      document.getElementById("loadMode").value = rule.requiredMode || (rule.allowedModes?.includes("sbs") ? "sbs" : "center");
      document.getElementById("deckLane").value = rule.requiredMode === "center" ? "center" : "auto";
      document.getElementById("customMinPositions").value = getQrgPositionsForMode(rule, { mode: rule.requiredMode || rule.allowedModes?.[0] || "center" });
      document.getElementById("customRequiredMode").value = rule.requiredMode || "none";
      applyingSpecialPreset = false;
    }
    document.querySelectorAll(".custom-rule").forEach((field) => {
      field.hidden = rule.key !== "custom";
    });
  });
  document.querySelectorAll(".custom-rule").forEach((field) => {
    field.hidden = true;
  });
  document.getElementById("resetPlanner").addEventListener("click", resetPlanner);
  ["length", "width", "height", "weight", "pieces", "unitCm", "unitIn"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      if (applyingSpecialPreset) return;
      const currentRule = getSpecialRule();
      if (currentRule.engineData) {
        specialSelect.value = "none";
        document.getElementById("customMinPositions").value = 0;
        document.getElementById("customRequiredMode").value = "none";
        document.getElementById("deckLane").value = "auto";
        document.getElementById("loadMode").value = "auto";
      }
      document.getElementById("pallet").value = "auto";
      document.getElementById("extraLayer").value = "auto";
    });
    document.getElementById(id).addEventListener("change", () => {
      if (applyingSpecialPreset) return;
      const currentRule = getSpecialRule();
      if (currentRule.engineData) {
        specialSelect.value = "none";
        document.getElementById("customMinPositions").value = 0;
        document.getElementById("customRequiredMode").value = "none";
        document.getElementById("deckLane").value = "auto";
        document.getElementById("loadMode").value = "auto";
      }
      document.getElementById("pallet").value = "auto";
      document.getElementById("extraLayer").value = "auto";
    });
  });
  document.getElementById("plannerForm").addEventListener("input", render);
  document.getElementById("plannerForm").addEventListener("change", render);
  render();
}

init();
