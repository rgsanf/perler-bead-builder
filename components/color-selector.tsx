import { Eraser, PaintBucket, Plus, X } from "lucide-react";
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface BeadColor {
  name: string;
  value: string;
}

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  paintCanMode: boolean;
  onPaintCanModeToggle: () => void;
  eraserMode: boolean;
  onEraserModeToggle: () => void;
  colorsRow1: BeadColor[];
  colorsRow2: BeadColor[];
  customColors: (string | null)[];
  onCustomColorChange: (index: number, color: string | null) => void;
}

export const ColorSelector = memo(function ColorSelector({
  selectedColor,
  onColorSelect,
  paintCanMode,
  onPaintCanModeToggle,
  eraserMode,
  onEraserModeToggle,
  colorsRow1,
  colorsRow2,
  customColors,
  onCustomColorChange,
}: ColorSelectorProps) {
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingColorRef = useRef<string | null>(null);
  const debounceCustomColorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingCustomColorRef = useRef<{
    index: number;
    color: string | null;
  } | null>(null);

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (debounceCustomColorTimerRef.current) {
        clearTimeout(debounceCustomColorTimerRef.current);
      }
    };
  }, []);

  const handleCustomColorClick = useCallback(
    (index: number) => {
      if (customColors[index]) {
        // If color exists, select it
        onColorSelect(customColors[index]!);
      } else {
        // If empty, trigger color picker directly
        const input = colorInputRefs.current[index];
        if (input) {
          input.click();
        }
      }
    },
    [customColors, onColorSelect]
  );

  // Debounced color selection handler
  const debouncedColorSelect = useCallback(
    (color: string) => {
      // Clear any pending updates
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Store the pending color
      pendingColorRef.current = color;

      // Debounce the actual state update and use startTransition for non-blocking updates
      debounceTimerRef.current = setTimeout(() => {
        if (pendingColorRef.current) {
          startTransition(() => {
            onColorSelect(pendingColorRef.current!);
          });
          pendingColorRef.current = null;
        }
      }, 100); // 100ms debounce for smooth dragging
    },
    [onColorSelect]
  );

  // Debounced custom color change handler
  const debouncedCustomColorChange = useCallback(
    (index: number, color: string | null) => {
      // Clear any pending updates
      if (debounceCustomColorTimerRef.current) {
        clearTimeout(debounceCustomColorTimerRef.current);
      }

      // Store the pending color change
      pendingCustomColorRef.current = { index, color };

      // Debounce the actual state update and use startTransition for non-blocking updates
      debounceCustomColorTimerRef.current = setTimeout(() => {
        if (pendingCustomColorRef.current) {
          startTransition(() => {
            onCustomColorChange(
              pendingCustomColorRef.current!.index,
              pendingCustomColorRef.current!.color
            );
          });
          pendingCustomColorRef.current = null;
        }
      }, 150); // 150ms debounce for custom color updates
    },
    [onCustomColorChange]
  );

  const handleColorPickerInput = useCallback(
    (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      // Update button background immediately for visual feedback (no state update)
      const button = event.target.nextElementSibling as HTMLButtonElement;
      if (button) {
        button.style.backgroundColor = color;
      }
      // Debounce both the custom color change and color selection
      debouncedCustomColorChange(index, color);
      debouncedColorSelect(color);
    },
    [debouncedCustomColorChange, debouncedColorSelect]
  );

  const handleColorPickerChange = useCallback(
    (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      // onChange fires when user releases/done, so update immediately
      const color = event.target.value;
      debouncedCustomColorChange(index, color);
      debouncedColorSelect(color);
    },
    [debouncedCustomColorChange, debouncedColorSelect]
  );

  const handleCustomColorRemove = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      onCustomColorChange(index, null);
    },
    [onCustomColorChange]
  );

  // Memoize color buttons to prevent unnecessary re-renders
  const colorButtonsRow1 = useMemo(
    () =>
      colorsRow1.map((color) => (
        <button
          key={color.value}
          onClick={() => onColorSelect(color.value)}
          className={`
          h-12 w-full rounded-full border-2 transition-all transform hover:scale-105
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
      )),
    [colorsRow1, selectedColor, onColorSelect]
  );

  const colorButtonsRow2 = useMemo(
    () =>
      colorsRow2.map((color) => (
        <button
          key={color.value}
          onClick={() => onColorSelect(color.value)}
          className={`
          h-12 w-full rounded-full border-2 transition-all transform hover:scale-105
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
      )),
    [colorsRow2, selectedColor, onColorSelect]
  );

  // Memoize custom color slots
  const customColorSlots = useMemo(
    () =>
      customColors.map((color, index) => (
        <div key={index} className="relative group">
          <input
            type="color"
            ref={(el) => {
              colorInputRefs.current[index] = el;
            }}
            value={color || "#FFFFFF"}
            onInput={(e) =>
              handleColorPickerInput(
                index,
                e as React.ChangeEvent<HTMLInputElement>
              )
            }
            onChange={(e) => handleColorPickerChange(index, e)}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            aria-hidden="true"
          />
          <button
            onClick={() => handleCustomColorClick(index)}
            className={`
            h-12 w-full rounded-full border-2 transition-all transform hover:scale-105 relative
            ${
              color
                ? selectedColor === color
                  ? "border-gray-800 ring-2 ring-offset-2 ring-gray-400 scale-110"
                  : "border-gray-300 hover:border-gray-400"
                : "border-dashed border-gray-300 hover:border-gray-400 bg-gray-50"
            }
          `}
            style={color ? { backgroundColor: color } : {}}
            title={
              color
                ? `Custom Color ${index + 1}`
                : `Add Custom Color ${index + 1}`
            }
            aria-label={
              color
                ? `Select custom color ${index + 1}`
                : `Add custom color ${index + 1}`
            }
          >
            {!color && (
              <Plus
                size={20}
                className="text-gray-400 absolute inset-0 m-auto pointer-events-none"
              />
            )}
          </button>
          {color && (
            <button
              onClick={(e) => handleCustomColorRemove(index, e)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full border border-white flex items-center justify-center text-white text-sm leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove custom color"
              aria-label="Remove custom color"
            >
              <X size={10} />
            </button>
          )}
        </div>
      )),
    [
      customColors,
      selectedColor,
      handleCustomColorClick,
      handleColorPickerInput,
      handleColorPickerChange,
      handleCustomColorRemove,
    ]
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6 print:hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Select Color</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onEraserModeToggle}
            className={`
              px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 border-2
              ${
                eraserMode
                  ? "bg-red-500 text-white border-red-600 hover:bg-red-600 ring-2 ring-red-300 ring-offset-2"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }
            `}
            title="Eraser Tool - Remove beads"
          >
            <Eraser size={18} />
          </button>
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
          </button>
        </div>
      </div>

      {/* Row 1: Primary/Bright Colors */}
      <div className="grid grid-cols-10 gap-3 mb-3">{colorButtonsRow1}</div>

      {/* Row 2: Lighter/Pastel Colors */}
      <div className="grid grid-cols-10 gap-3 mb-3">{colorButtonsRow2}</div>

      {/* Row 3: Custom Colors */}
      <div className="grid grid-cols-10 gap-3">{customColorSlots}</div>
    </div>
  );
});
