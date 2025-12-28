"use client";

import { Download, PaintBucket, Printer, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const GRID_SIZE = 29;
const BEAD_COLORS = [
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#00FF00" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Orange", value: "#FFA500" },
  { name: "Purple", value: "#800080" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Cyan", value: "#00FFFF" },
  { name: "Magenta", value: "#FF00FF" },
  { name: "Grey", value: "#808080" },
  { name: "Dark Green", value: "#006400" },
];

const STORAGE_KEY = "perler-bead-design";

const createEmptyGrid = (): string[][] => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(""));
};

export default function Home() {
  const [grid, setGrid] = useState<string[][]>(createEmptyGrid);
  const [selectedColor, setSelectedColor] = useState<string>(
    BEAD_COLORS[0].value
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintCanMode, setPaintCanMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      const hasSavedData = saved !== null;

      // Use setTimeout to defer state updates and avoid linter warning
      setTimeout(() => {
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setGrid(parsed);
          } catch (e) {
            console.error("Failed to load saved design:", e);
          }
        }
        setHasSaved(hasSavedData);
      }, 0);
    }
  }, []);

  const saveDesign = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
        setSaveMessage("Design saved!");
        setHasSaved(true);
        setTimeout(() => setSaveMessage(""), 2000);
      } catch (e) {
        console.error("Failed to save design:", e);
        setSaveMessage("Failed to save");
        setTimeout(() => setSaveMessage(""), 2000);
      }
    }
  }, [grid]);

  const loadDesign = useCallback(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setGrid(parsed);
          setSaveMessage("Design loaded!");
          setTimeout(() => setSaveMessage(""), 2000);
        } catch (e) {
          console.error("Failed to load saved design:", e);
          setSaveMessage("Failed to load");
          setTimeout(() => setSaveMessage(""), 2000);
        }
      } else {
        setSaveMessage("No saved design found");
        setTimeout(() => setSaveMessage(""), 2000);
      }
    }
  }, []);

  const handleBeadClick = useCallback(
    (row: number, col: number) => {
      if (paintCanMode) {
        setGrid((prev) => {
          const targetColor = prev[row][col];
          if (targetColor === selectedColor) return prev; // No need to fill if colors are the same

          const newGrid = prev.map((r) => [...r]);
          const visited = new Set<string>();
          const queue: [number, number][] = [[row, col]];

          while (queue.length > 0) {
            const [r, c] = queue.shift()!;
            const key = `${r},${c}`;

            // Check bounds
            if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) continue;
            if (visited.has(key)) continue;

            // Check if this cell matches the target color
            if (newGrid[r][c] !== targetColor) continue;

            visited.add(key);
            newGrid[r][c] = selectedColor;

            // Add neighbors to queue
            queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
          }

          return newGrid;
        });
      } else {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] =
            prev[row][col] === selectedColor ? "" : selectedColor;
          return newGrid;
        });
      }
    },
    [selectedColor, paintCanMode]
  );

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      setIsDrawing(true);
      handleBeadClick(row, col);
    },
    [handleBeadClick]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isDrawing) {
        handleBeadClick(row, col);
      }
    },
    [isDrawing, handleBeadClick]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearGrid = useCallback(() => {
    setGrid(
      Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(""))
    );
  }, []);

  const calculateColorQuantities = useCallback(() => {
    const quantities: Record<string, number> = {};
    grid.forEach((row) => {
      row.forEach((color) => {
        if (color) {
          quantities[color] = (quantities[color] || 0) + 1;
        }
      });
    });
    return quantities;
  }, [grid]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const colorQuantities = calculateColorQuantities();
  const sortedColors = Object.entries(colorQuantities)
    .map(([value, count]) => {
      const colorInfo = BEAD_COLORS.find((c) => c.value === value);
      return {
        name: colorInfo?.name || "Unknown",
        value,
        count,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="main-container min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8 print:bg-white print:bg-none print:p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 print:hidden">
          Perler Bead Designer
        </h1>
        <p className="text-center text-gray-600 mb-8 print:hidden">
          Click or drag to place beads on the 29×29 grid
        </p>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6 print:hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Select Color
            </h2>
            <button
              onClick={() => setPaintCanMode(!paintCanMode)}
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
              {paintCanMode && (
                <span className="ml-1 text-xs font-bold">ON</span>
              )}
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
            {BEAD_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
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

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6 print:shadow-none print:p-4">
          <div className="flex justify-between items-center mb-4 print:hidden">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Design Grid
              </h2>
              {saveMessage && (
                <span
                  className={`text-sm font-medium ${
                    saveMessage.includes("Failed")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {saveMessage}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium print:hidden flex items-center gap-2"
              >
                <Printer size={18} />
                Print
              </button>
              <button
                onClick={clearGrid}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium print:hidden flex items-center gap-2"
              >
                <Trash2 size={18} />
                Clear Grid
              </button>
            </div>
          </div>

          <div
            ref={gridRef}
            className="inline-block border-2 border-gray-300 rounded-lg bg-gray-50 print:border-gray-800 grid-container-print"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="grid gap-0.5"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((color, colIndex) => {
                  const isEmpty = !color;
                  const isWhite = color === "#FFFFFF";

                  const cellStyle = isEmpty
                    ? {
                        backgroundColor: "#FFFFFF",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "#E5E7EB",
                        boxShadow: "none",
                      }
                    : isWhite
                    ? {
                        backgroundColor: "#FFFFFF",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        borderColor: "#1F2937",
                        boxShadow: "0 0 0 1px #1F2937",
                      }
                    : {
                        backgroundColor: color,
                        borderWidth: "0px",
                        borderStyle: "none",
                        borderColor: "transparent",
                        boxShadow: "none",
                      };

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      className={`aspect-square w-4 h-4 rounded-sm cursor-pointer transition-all print:cursor-default hover:ring-1 hover:ring-gray-400 print:hover:ring-0${
                        isEmpty ? " bg-white border border-gray-200" : ""
                      }`}
                      style={cellStyle}
                      title={`Row ${rowIndex + 1}, Col ${colIndex + 1}`}
                    />
                  );
                })
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4 print:hidden">
            <div className="flex gap-2">
              <button
                onClick={saveDesign}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium print:hidden flex items-center gap-2"
                title="Save design to browser storage"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={loadDesign}
                className={`px-4 py-2 rounded-lg transition-colors font-medium print:hidden flex items-center gap-2 ${
                  hasSaved
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title="Load saved design"
                disabled={!hasSaved}
              >
                <Download size={18} />
                Load
              </button>
            </div>
          </div>
        </div>

        {sortedColors.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-6 print:shadow-none print:p-4 print:break-inside-avoid">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 print:text-lg">
              Color Quantities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 print:grid-cols-3">
              {sortedColors.map(({ name, value, count }) => (
                <div
                  key={value}
                  className="flex items-center gap-3 print:gap-2"
                >
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-300 print:w-6 print:h-6 shrink-0"
                    style={{ backgroundColor: value }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 print:text-sm">
                      {name}
                    </div>
                    <div className="text-sm text-gray-600 print:text-xs">
                      {count} bead{count !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6 print:hidden">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Instructions
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Select a color from the palette above</li>
            <li>Click on a grid cell to place a bead</li>
            <li>Hold and drag to place multiple beads</li>
            <li>Click on a colored bead to remove it</li>
            <li>
              Use the &quot;Paint Can&quot; tool to fill connected areas of the
              same color
            </li>
            <li>Use &quot;Clear Grid&quot; to start over</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
