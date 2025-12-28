import { PaintBucket } from "lucide-react";

interface BeadColor {
  name: string;
  value: string;
}

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  paintCanMode: boolean;
  onPaintCanModeToggle: () => void;
  colors: BeadColor[];
}

export function ColorSelector({
  selectedColor,
  onColorSelect,
  paintCanMode,
  onPaintCanModeToggle,
  colors,
}: ColorSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6 print:hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Select Color</h2>
        <button
          onClick={onPaintCanModeToggle}
          className={`
            px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 border-2
            ${
              paintCanMode
                ? "bg-green-500 text-white border-green-600 hover:bg-green-600 ring-2 ring-green-300 ring-offset-2"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }
          `}
          title="Paint Can Tool - Fill connected areas"
        >
          <PaintBucket size={18} />
          <span>Paint Can</span>
          {paintCanMode && <span className="ml-1 text-xs font-bold">ON</span>}
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={`
              h-12 w-full rounded-lg border-2 transition-all transform hover:scale-105
              ${
                selectedColor === color.value
                  ? "border-gray-800 ring-2 ring-offset-2 ring-gray-400 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
}
