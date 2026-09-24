import {
  Box,
  Cpu,
  Monitor,
  HardDrive,
  BatteryCharging,
  Fan,
  MemoryStick,
  Keyboard,
} from "lucide-react";

/**
 * Category name -> icon shared by the Home page tiles, the header
 * dropdown and the filter sidebars.
 */
export const CATEGORY_ICONS = {
  "Processors (CPU)": Cpu,
  Motherboards: Box,
  "Graphics Cards (GPU)": Monitor,
  RAM: MemoryStick,
  Storage: HardDrive,
  "Power Supplies (PSU)": BatteryCharging,
  Cooling: Fan,
  "PC Cases": Box,
  Monitors: Monitor,
  Peripherals: Keyboard,
};

export function categoryIcon(name) {
  return CATEGORY_ICONS[name] || Box;
}

/** Known slug for each category — used for clean /category/:slug links. */
export const CATEGORY_SLUGS = {
  "Processors (CPU)": "processors",
  Motherboards: "motherboards",
  "Graphics Cards (GPU)": "graphics-cards-gpu",
  RAM: "ram",
  Storage: "storage",
  "Power Supplies (PSU)": "power-supplies",
  Cooling: "cooling",
  "PC Cases": "pc-cases",
  Monitors: "monitors",
  Peripherals: "peripherals",
};

export function categorySlug(name) {
  return CATEGORY_SLUGS[name] || null;
}