import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/delivery/check?pincode=560001  (public)
 *
 * Serviceability lookup for the product page's "Check Delivery" box.
 *
 * Every valid Indian PIN code (6 digits, leading digit 1-9) is
 * serviceable. The leading digit selects the courier zone, which sets the
 * estimated delivery window (see ZONES below).
 *
 * This is demo logic — no live courier API is wired up — but the numbers
 * come from here rather than being hard-coded in the frontend, so the
 * page stays purely a consumer of the API.
 */
const ZONES = {
  1: { zone: "North India", etaMin: 1, etaMax: 3 },
  2: { zone: "Central India", etaMin: 2, etaMax: 4 },
  3: { zone: "West India", etaMin: 2, etaMax: 4 },
  4: { zone: "West India", etaMin: 2, etaMax: 4 },
  5: { zone: "South India", etaMin: 3, etaMax: 5 },
  6: { zone: "South India", etaMin: 3, etaMax: 5 },
  7: { zone: "East India", etaMin: 3, etaMax: 5 },
  8: { zone: "East India", etaMin: 3, etaMax: 5 },
  9: { zone: "Remote / APO", etaMin: 4, etaMax: 7 },
};

/** "3-5 business days" / "1 business day" — used verbatim by the UI. */
function etaLabel(min, max) {
  return min === max ? `${min} business day` : `${min}-${max} business days`;
}

export const checkPincode = asyncHandler(async (req, res) => {
  const raw = String(req.query?.pincode ?? "").trim();

  if (!/^[1-9][0-9]{5}$/.test(raw)) {
    return res.status(400).json({
      success: false,
      message: "PIN code must be 6 digits and cannot start with 0.",
    });
  }

  const { zone, etaMin, etaMax } = ZONES[Number(raw[0])];

  return res.json({
    success: true,
    pincode: raw,
    serviceable: true,
    zone,
    etaMin,
    etaMax,
    etaLabel: etaLabel(etaMin, etaMax),
    codAvailable: true,
  });
});
