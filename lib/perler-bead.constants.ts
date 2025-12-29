export const GRID_SIZE = 29;

// Row 1: Primary/Bright Colors
export const BEAD_COLORS_ROW1 = [
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#404040" },
  { name: "Dark Red", value: "#8B0000" },
  { name: "Bright Red", value: "#FF0000" },
  { name: "Orange", value: "#FFA500" },
  { name: "Bright Yellow", value: "#FFFF00" },
  { name: "Bright Green", value: "#00FF00" },
  { name: "Bright Cyan", value: "#00FFFF" },
  { name: "Dark Blue", value: "#0000CD" },
  { name: "Purple", value: "#800080" },
];

// Row 2: Lighter/Pastel Colors
export const BEAD_COLORS_ROW2 = [
  { name: "White", value: "#FFFFFF" },
  { name: "Light Gray", value: "#C0C0C0" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Light Pink", value: "#FFB6C1" },
  { name: "Yellow", value: "#FFD700" },
  { name: "Cream", value: "#FFFDD0" },
  { name: "Lime Green", value: "#32CD32" },
  { name: "Light Blue", value: "#87CEEB" },
  { name: "Medium Blue", value: "#4169E1" },
  { name: "Lavender", value: "#E6E6FA" },
];

// Combined predefined colors
export const BEAD_COLORS = [...BEAD_COLORS_ROW1, ...BEAD_COLORS_ROW2];

// Number of custom color slots
export const CUSTOM_COLOR_SLOTS = 10;

export const STORAGE_KEY = "perler-bead-design";
export const CUSTOM_COLORS_STORAGE_KEY = "perler-bead-custom-colors";

