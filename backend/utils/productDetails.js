/**
 * Structured "Product Details" builder.
 *
 * The product detail page shows a labelled spec table (CPU: cores,
 * threads, GHz, socket, TDP — RAM: capacity, DDR generation, MHz, CL —
 * GPU: VRAM, memory type, bus width ...). Every value is derived from
 * the product row itself (its spec bullet list, its filter facets, its
 * name and description), and each category only ever emits fields that
 * are relevant to it.
 *
 * The result is an ordered array of `{ label, value }` rows, stored on
 * the `products.details` JSON column and returned by the API through
 * `toProductJson`. `buildProductDetails` stays pure/idempotent so it can
 * be re-run for seeding, backfilling and admin create/update.
 */

/** Parse the `specifications` column (JSON array / object / CSV string). */
export function parseSpecifications(value) {
  const parsed = parseJson(value, null);
  if (Array.isArray(parsed)) return parsed.map(String).map(clean).filter(Boolean);
  if (parsed && typeof parsed === "object") {
    return Object.entries(parsed).map(([k, v]) => clean(`${k}: ${v}`)).filter(Boolean);
  }
  if (value && typeof value === "string") {
    return value.split(",").map(clean).filter(Boolean);
  }
  return [];
}

/** Parse the `facets` JSON column into a plain object. */
export function parseFacets(value) {
  const parsed = parseJson(value, null);
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

/** Parse a JSON column that MySQL may return as a string. */
function parseJson(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function clean(value) {
  return String(value ?? "").trim();
}

/** Generic labels for filter facets (used by the fallback builder). */
const FACET_LABELS = {
  chipset: "Chipset",
  socket: "Socket",
  cores: "Cores",
  vram: "VRAM",
  dimm: "Memory Type",
  capacity: "Capacity",
  speed: "Speed",
  storage_type: "Drive Type",
  form_factor: "Form Factor",
  type: "Type",
  size: "Size",
  panel: "Panel Type",
  refresh: "Refresh Rate",
  wattage: "Wattage",
  certification: "Efficiency",
  modular: "Modular",
  rgb: "RGB Lighting",
  side_panel: "Side Panel",
  connection: "Connection",
  switch: "Switch Type",
};

/** Category string -> builder key. */
function categoryKey(category = "") {
  const key = String(category).toLowerCase();
  if (/\bprocessor|cpu\b/.test(key)) return "cpu";
  if (/graphic|gpu|video card/.test(key)) return "gpu";
  if (/motherboard/.test(key)) return "mainboard";
  if (/\bram\b|memory/.test(key)) return "ram";
  if (/storage|ssd|hdd|hard disk/.test(key)) return "storage";
  if (/power|psu/.test(key)) return "psu";
  if (/cool|radiator|fan/.test(key)) return "cooling";
  if (/case|cabinet/.test(key)) return "case";
  if (/monitor|display/.test(key)) return "monitor";
  if (/peripheral|keyboard|mouse|headset|speaker/.test(key)) return "peripheral";
  return "generic";
}

/**
 * Create the read helpers a builder works against: every matcher runs
 * over the spec bullet list first (that is where the interesting numbers
 * live) and callers can fall back to the name/description.
 */
function createMatchers(product) {
  const specs = parseSpecifications(product.specifications);
  const facets = parseFacets(product.facets);
  const name = clean(product.name);
  const description = clean(product.description);
  const text = specs.join(" | ");

  /** First capture group (or the whole match) of `re` over the specs. */
  const match = (re) => {
    const found = text.match(re);
    if (!found) return "";
    return clean(found[1] ?? found[0]);
  };

  /** Same, but against the product name (models only live there). */
  const matchName = (re) => {
    const found = name.match(re);
    if (!found) return "";
    return clean(found[1] ?? found[0]);
  };

  /** Same, but against name + description (marketing features). */
  const matchCopy = (re) => {
    const found = `${name} ${description}`.match(re);
    if (!found) return "";
    return clean(found[1] ?? found[0]);
  };

  /** First spec bullet matching `re` verbatim (keeps the original text). */
  const spec = (re) => specs.find((item) => re.test(item)) || "";

  /** First facet value that is set. */
  const facet = (...keys) => {
    for (const key of keys) {
      const value = facets[key];
      if (value === undefined || value === null || value === "") continue;
      return clean(value);
    }
    return "";
  };

  /** Lighting value used by RAM / cooling / cases / peripherals. */
  const lighting = () => {
    if (/\bARGB\b/i.test(text)) return "ARGB";
    if (/\bRGB\b/i.test(text)) return "RGB";
    if (facets.rgb) return "RGB";
    return "";
  };

  return { specs, facets, name, description, text, match, matchName, matchCopy, spec, facet, lighting };
}

/**
 * Normalise raw values so units read consistently:
 * "3200MHz" -> "3200 MHz", "240mm" -> "240 mm", "65W" -> "65 W".
 * Already-spaced values pass through untouched.
 */
function formatValue(value) {
  return clean(value).replace(
    /(\d)\s*(GHz|MHz|Hz|mm|MB\/s|W)(?![a-z/])/gi,
    (_, digits, unit) => `${digits} ${unit}`
  );
}

/* ------------------------------------------------------------------ *
 * Per-category builders — only fields that make sense for the product
 * ------------------------------------------------------------------ */

function buildCpu(ctx) {
  const rows = [];
  const cores = ctx.facet("cores") || ctx.match(/(\d+)\s*Cores?\b/i);
  const threads = ctx.match(/\/\s*(\d+)\s*Threads?\b/i) || ctx.match(/(\d+)\s*Threads?\b/i);
  const base = ctx.match(/\bBase(?:\s*Clock)?[^|]*?(\d+(?:\.\d+)?)\s*GHz/i);
  const boost = ctx.match(/(\d+(?:\.\d+)?)\s*GHz/i);
  const socket = ctx.facet("socket") || ctx.match(/\b(LGA\s*\d+|AM[45]|FM2\+?)\b/i);
  const tdp = ctx.match(/(\d+)\s*W\s*TDP/i);
  const platform = ctx.facet("chipset") || ctx.matchName(/\b(Intel|AMD)\b/i);

  rows.push(["Cores", cores]);
  rows.push(["Threads", threads]);
  rows.push(["Base Clock", base ? `${base} GHz` : ""]);
  rows.push(["Boost Clock", boost ? `${boost} GHz` : ""]);
  rows.push(["Socket", socket]);
  rows.push(["TDP", tdp ? `${tdp} W` : ""]);
  rows.push(["Platform", platform]);
  return rows;
}

function buildGpu(ctx) {
  const rows = [];
  const modelName = ctx.name.match(
    /\b(?:(?:GeForce|Radeon|NVIDIA|AMD)\s+)?(?:RTX|RX|GTX)\s+\d{3,4}(?:\s*Ti)?\b/i
  );
  const model = (modelName ? modelName[0].trim() : "") || ctx.facet("chipset");
  const vram = ctx.facet("vram") || ctx.match(/(\d+\s*GB)\b/i);
  const memoryType = ctx.match(/\b(GDDR\d|HBM\d?)\b/i);
  const bus = ctx.match(/\b(\d+-bit)\b/i);
  const cooling = ctx.match(/(\d+\s*Fans?)\b/i);
  const features = ctx.specs.filter((item) => /DLSS|FSR|Ray Tracing|Reflex|G-Sync|FreeSync/i.test(item));

  rows.push(["Graphics Processor", model]);
  rows.push(["VRAM", vram]);
  rows.push(["Memory Type", memoryType]);
  rows.push(["Memory Bus", bus]);
  rows.push(["Cooling", cooling]);
  rows.push(["Features", features.join(", ")]);
  return rows;
}

function buildMainboard(ctx) {
  const rows = [];
  const chipset = ctx.matchName(/\b([BZX]\d{3}[A-Z]?)\b/i);
  const socket = ctx.facet("socket") || ctx.match(/\b(LGA\s*\d+|AM[45]|FM2\+?)\b/i);
  const platform = ctx.facet("chipset");
  const formFactor = ctx.facet("form_factor");
  const memoryType = ctx.facet("dimm") || ctx.match(/\b(DDR[45])\b/i);
  const expansion = ctx.spec(/PCIe\s*\d/i);
  const m2 = ctx.spec(/^M\.2/i).replace(/^M\.2\s*/i, "");
  const wireless = ctx.spec(/WiFi/i);

  rows.push(["Socket", socket]);
  rows.push(["Chipset", chipset]);
  rows.push(["Platform", platform]);
  rows.push(["Form Factor", formFactor]);
  rows.push(["Memory Type", memoryType]);
  rows.push(["Expansion", expansion]);
  rows.push(["M.2 Slots", m2 ? `x${m2.replace(/^x/i, "")}` : ""]);
  rows.push(["Wireless", wireless]);
  return rows;
}

function buildRam(ctx) {
  const rows = [];
  const capacity = ctx.facet("capacity") || ctx.match(/\b(\d+\s*GB)\b/i);
  const memoryType = ctx.facet("dimm") || ctx.match(/\b(DDR[45])\b/i);
  const speed = ctx.facet("speed") || ctx.match(/\b(\d{4}\s*MHz)\b/i);
  const latency = ctx.spec(/\bCL\d+\b/i);
  const profiles = ctx.spec(/XMP|EXPO|Plug-n-Play/i);
  const lighting = ctx.lighting();

  rows.push(["Capacity", capacity]);
  rows.push(["Memory Type", memoryType]);
  rows.push(["Speed", speed]);
  rows.push(["CAS Latency", latency]);
  rows.push(["Profiles", profiles]);
  rows.push(["Lighting", lighting]);
  return rows;
}

function buildStorage(ctx) {
  const rows = [];
  const capacity = ctx.facet("capacity") || ctx.match(/\b(\d+\s*(?:GB|TB))\b/i);
  const driveType = ctx.facet("storage_type") || ctx.match(/\b(SSD|HDD)\b/i);
  const driveInterface = ctx.spec(/NVMe|SATA|PCIe/i);
  const readSpeed = ctx.match(/(\d+\s*MB\/s)/i);
  const rpm = ctx.spec(/\d+\s*RPM/i);
  const formFactor = ctx.facet("form_factor");

  rows.push(["Capacity", capacity]);
  rows.push(["Drive Type", driveType]);
  rows.push(["Interface", driveInterface]);
  rows.push(["Read Speed", readSpeed]);
  rows.push(["Spindle Speed", rpm]);
  rows.push(["Form Factor", formFactor]);
  return rows;
}

function buildPsu(ctx) {
  const rows = [];
  const wattage = ctx.facet("wattage") || ctx.match(/\b(\d{3}\s*W)\b/i);
  const efficiency =
    ctx.facet("certification") || ctx.spec(/80\+\s*\w+|\bStandard\b/i);
  const modular = ctx.facets.modular ? "Yes" : "";
  const fan = ctx.match(/(\d+\s*mm)\s*Fan/i);
  const features = ctx.specs.filter((item) => /Zero RPM/i.test(item));

  rows.push(["Wattage", wattage]);
  rows.push(["Efficiency", efficiency]);
  rows.push(["Modular", modular]);
  rows.push(["Fan Size", fan]);
  rows.push(["Features", features.join(", ")]);
  return rows;
}

function buildCooling(ctx) {
  const rows = [];
  const type = ctx.facet("type");
  const size = ctx.facet("size") || ctx.match(/\b(\d{2,3}\s*mm)\b/i);
  const tdp = ctx.match(/(\d+\s*W)\s*TDP/i);
  const heatpipes = ctx.match(/(\d+)\s*Heatpipes?\b/i);
  const lighting = ctx.lighting();
  const features = ctx.specs.filter((item) => /LCD Display|Zero RPM/i.test(item));

  rows.push(["Cooler Type", type]);
  rows.push(["Size", size]);
  rows.push(["TDP Rating", tdp]);
  rows.push(["Heatpipes", heatpipes]);
  rows.push(["Lighting", lighting]);
  rows.push(["Features", features.join(", ")]);
  return rows;
}

function buildCase(ctx) {
  const rows = [];
  const formFactor = ctx.facet("form_factor");
  const boardSupport = ctx.spec(/\b(E-ATX|ATX|Micro ATX|Mini ITX)\b/i);
  const sidePanel = ctx.facet("side_panel");
  const frontPanel = ctx.spec(/Mesh Front|RGB Front|Front Mesh/i);
  const fanSupport = ctx.match(/(\d+\s*Fans?\s*Support)/i);
  const lighting = ctx.lighting();

  rows.push(["Form Factor", formFactor]);
  rows.push(["Motherboard Support", boardSupport]);
  rows.push(["Side Panel", sidePanel]);
  rows.push(["Front Panel", frontPanel]);
  rows.push(["Fan Support", fanSupport]);
  rows.push(["Lighting", lighting]);
  return rows;
}

function buildMonitor(ctx) {
  const rows = [];
  const size = ctx.facet("size") || ctx.match(/\b(\d+(?:\.\d+)?)-inch/i);
  const panel = ctx.facet("panel");
  const resolution = ctx.match(/\b(\d{3,4}\s*[xX]\s*\d{3,4})\b/);
  const refresh = ctx.facet("refresh") || ctx.match(/\b(\d+\s*Hz)\b/i);
  const sync = ctx.matchCopy(/\b((?:AMD\s+)?FreeSync(?:\s+(?:Premium|Ultimate))?|NVIDIA\s+G-Sync|G-Sync(?:\s+Compatible)?|Adaptive-Sync)\b/i);

  rows.push(["Screen Size", size ? (size.includes('"') ? size : `${size}"`) : ""]);
  rows.push(["Panel Type", panel]);
  rows.push(["Resolution", resolution]);
  rows.push(["Refresh Rate", refresh]);
  rows.push(["Adaptive Sync", sync]);
  return rows;
}

function buildPeripheral(ctx) {
  const rows = [];
  const kind = ctx.facet("type");
  const connection = ctx.facet("connection") || ctx.spec(/\b(USB|Wired|Wireless)\b/i);
  const lighting = ctx.lighting();

  rows.push(["Device Type", kind]);
  rows.push(["Connection", connection]);

  if (/mouse/i.test(kind)) {
    const dpi = ctx.match(/([\d,]+)\s*DPI/i);
    rows.push(["DPI", dpi ? `${dpi} DPI` : ""]);
    rows.push(["Sensor", ctx.spec(/\b\w+\s+Sensor\b/i)]);
    rows.push(["Design", ctx.spec(/Ergonomic|Ambidextrous/i)]);
    rows.push(["Lighting", lighting]);
  } else if (/keyboard/i.test(kind)) {
    rows.push(["Layout", ctx.spec(/\b(TKL|Full Size|Compact|104-Key)\b/i)]);
    rows.push(["Switch Type", ctx.facet("switch")]);
    rows.push(["Lighting", lighting]);
    rows.push(["Features", ctx.spec(/Spill Resistant/i)]);
  } else if (/headset/i.test(kind)) {
    rows.push(["Drivers", ctx.match(/(\d+\s*mm)\s*Drivers/i)]);
    rows.push(["Surround Sound", ctx.match(/((?:\d\.\d\s*)?Surround)/i)]);
    rows.push(["Interface", ctx.spec(/\b(USB|3\.5mm)\b/i)]);
    rows.push(["Lighting", lighting]);
  } else if (/speaker/i.test(kind)) {
    rows.push(["Channels", ctx.spec(/^\d\.\d$/)]);
    rows.push(["Output", ctx.spec(/Stereo|Mono/i)]);
    rows.push(["Connector", ctx.spec(/\d+mm/i)]);
  } else {
    rows.push(["Lighting", lighting]);
    rows.push(["Features", ctx.specs.filter((item) => /\+|Combo/i.test(item)).join(", ")]);
  }

  return rows;
}

/** Fallback: show every facet with a human label. */
function buildGeneric(ctx) {
  const rows = Object.entries(ctx.facets).map(([key, value]) => [
    FACET_LABELS[key] || key.replace(/_/g, " "),
    value,
  ]);
  if (rows.length === 0 && ctx.category) rows.push(["Category", ctx.category]);
  return rows;
}

const BUILDERS = {
  cpu: buildCpu,
  gpu: buildGpu,
  mainboard: buildMainboard,
  ram: buildRam,
  storage: buildStorage,
  psu: buildPsu,
  cooling: buildCooling,
  case: buildCase,
  monitor: buildMonitor,
  peripheral: buildPeripheral,
  generic: buildGeneric,
};

/**
 * Build the ordered `{ label, value }[]` detail rows for one product.
 *
 * @param {{name?: string, category?: string, description?: string,
 *          specifications?: unknown, facets?: unknown}} product
 * @returns {Array<{label: string, value: string}>}
 */
export function buildProductDetails(product = {}) {
  const ctx = createMatchers(product);
  const builder = BUILDERS[categoryKey(product.category)] || buildGeneric;
  const seen = new Set();

  return builder(ctx)
    .map(([label, value]) => ({ label: clean(label), value: formatValue(value) }))
    .filter((row) => {
      if (!row.label || !row.value) return false;
      const key = row.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
