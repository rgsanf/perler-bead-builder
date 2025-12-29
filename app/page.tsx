"use client";

import { BeadQuantitiesList } from "@/components/bead-quantities-list";
import { ColorSelector } from "@/components/color-selector";
import { Instructions } from "@/components/instructions";
import { PageHeader } from "@/components/page-header";
import { SaveLoadButtons } from "@/components/save-load-buttons";
import { TemplateColorQuantities } from "@/components/template-color-quantities";
import { TemplateMap } from "@/components/template-map";
import { TemplatesHeader } from "@/components/templates-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Wrapper } from "@/components/wrapper";
import {
  BEAD_COLORS,
  BEAD_COLORS_ROW1,
  BEAD_COLORS_ROW2,
  CUSTOM_COLOR_SLOTS,
  CUSTOM_COLORS_STORAGE_KEY,
  GRID_SIZE,
  STORAGE_KEY,
} from "@/lib/perler-bead.constants";
import { Eraser, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Template {
  id: string;
  grid: string[][];
  x: number;
  y: number;
}

const createEmptyGrid = (): string[][] => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(""));
};

const createTemplate = (x: number = 0, y: number = 0): Template => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  grid: createEmptyGrid(),
  x,
  y,
});

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([createTemplate()]);
  const [selectedColor, setSelectedColor] = useState<string>(
    BEAD_COLORS[0].value
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintCanMode, setPaintCanMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const [drawingTemplateId, setDrawingTemplateId] = useState<string | null>(
    null
  );
  const [showIndividualColors, setShowIndividualColors] = useState(false);
  const [showOverallColors, setShowOverallColors] = useState(true);
  const [customColors, setCustomColors] = useState<(string | null)[]>(
    Array(CUSTOM_COLOR_SLOTS).fill(null)
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      const hasSavedData = saved !== null;

      // Use setTimeout to defer state updates and avoid linter warning
      setTimeout(() => {
        // Load custom colors
        const savedCustomColors = localStorage.getItem(
          CUSTOM_COLORS_STORAGE_KEY
        );
        if (savedCustomColors) {
          try {
            const parsedColors = JSON.parse(savedCustomColors);
            if (
              Array.isArray(parsedColors) &&
              parsedColors.length === CUSTOM_COLOR_SLOTS
            ) {
              setCustomColors(parsedColors);
            }
          } catch (e) {
            console.error("Failed to load custom colors:", e);
          }
        }

        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Support both old format (single grid) and new format (templates array)
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
              setTemplates(parsed);
            } else if (
              Array.isArray(parsed) &&
              parsed.length > 0 &&
              Array.isArray(parsed[0])
            ) {
              // Old format: single grid
              setTemplates([
                {
                  id: Date.now().toString(),
                  grid: parsed,
                  x: 0,
                  y: 0,
                },
              ]);
            } else {
              setTemplates([createTemplate()]);
            }
            // Ensure all templates have x/y coordinates
            setTemplates((prev) =>
              prev.map((t) => ({
                ...t,
                x: t.x ?? 0,
                y: t.y ?? 0,
              }))
            );
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        localStorage.setItem(
          CUSTOM_COLORS_STORAGE_KEY,
          JSON.stringify(customColors)
        );
        setSaveMessage("Design saved!");
        setHasSaved(true);
        setTimeout(() => setSaveMessage(""), 2000);
      } catch (e) {
        console.error("Failed to save design:", e);
        setSaveMessage("Failed to save");
        setTimeout(() => setSaveMessage(""), 2000);
      }
    }
  }, [templates, customColors]);

  const loadDesign = useCallback(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Support both old format (single grid) and new format (templates array)
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
            setTemplates(parsed);
          } else if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            Array.isArray(parsed[0])
          ) {
            // Old format: single grid
            setTemplates([
              {
                id: Date.now().toString(),
                grid: parsed,
                x: 0,
                y: 0,
              },
            ]);
          } else {
            setTemplates([createTemplate()]);
          }
          // Ensure all templates have x/y coordinates
          setTemplates((prev) =>
            prev.map((t) => ({
              ...t,
              x: t.x ?? 0,
              y: t.y ?? 0,
            }))
          );

          // Load custom colors
          const savedCustomColors = localStorage.getItem(
            CUSTOM_COLORS_STORAGE_KEY
          );
          if (savedCustomColors) {
            try {
              const parsedColors = JSON.parse(savedCustomColors);
              if (
                Array.isArray(parsedColors) &&
                parsedColors.length === CUSTOM_COLOR_SLOTS
              ) {
                setCustomColors(parsedColors);
              }
            } catch (e) {
              console.error("Failed to load custom colors:", e);
            }
          }

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
    (templateId: string, row: number, col: number) => {
      if (paintCanMode) {
        setTemplates((prev) =>
          prev.map((template) => {
            if (template.id !== templateId) return template;
            const targetColor = template.grid[row][col];
            if (targetColor === selectedColor) return template; // No need to fill if colors are the same

            const newGrid = template.grid.map((r) => [...r]);
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

            return { ...template, grid: newGrid };
          })
        );
      } else {
        setTemplates((prev) =>
          prev.map((template) => {
            if (template.id !== templateId) return template;
            const newGrid = [...template.grid];
            newGrid[row] = [...newGrid[row]];
            newGrid[row][col] =
              template.grid[row][col] === selectedColor ? "" : selectedColor;
            return { ...template, grid: newGrid };
          })
        );
      }
    },
    [selectedColor, paintCanMode]
  );

  const handleMouseDown = useCallback(
    (templateId: string, row: number, col: number) => {
      setIsDrawing(true);
      setDrawingTemplateId(templateId);
      handleBeadClick(templateId, row, col);
    },
    [handleBeadClick]
  );

  const handleMouseEnter = useCallback(
    (templateId: string, row: number, col: number) => {
      if (isDrawing && drawingTemplateId === templateId) {
        handleBeadClick(templateId, row, col);
      }
    },
    [isDrawing, drawingTemplateId, handleBeadClick]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setDrawingTemplateId(null);
  }, []);

  const clearGrid = useCallback((templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, grid: createEmptyGrid() }
          : template
      )
    );
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setTemplates((prev) =>
      prev.filter((template) => template.id !== templateId)
    );
  }, []);

  const addTemplate = useCallback(
    (direction: "top" | "bottom" | "left" | "right", referenceId: string) => {
      setTemplates((prev) => {
        const referenceTemplate = prev.find((t) => t.id === referenceId);
        if (!referenceTemplate) return prev;

        let newX = referenceTemplate.x;
        let newY = referenceTemplate.y;

        switch (direction) {
          case "top":
            newY = referenceTemplate.y - 1;
            break;
          case "bottom":
            newY = referenceTemplate.y + 1;
            break;
          case "left":
            newX = referenceTemplate.x - 1;
            break;
          case "right":
            newX = referenceTemplate.x + 1;
            break;
        }

        // Check if a template already exists at this position
        const existingAtPosition = prev.find(
          (t) => t.x === newX && t.y === newY
        );
        if (existingAtPosition) {
          return prev; // Don't add if position is occupied
        }

        const newTemplate = createTemplate(newX, newY);
        return [...prev, newTemplate];
      });
    },
    []
  );

  const calculateColorQuantities = useCallback(() => {
    const quantities: Record<string, number> = {};
    templates.forEach((template) => {
      template.grid.forEach((row) => {
        row.forEach((color) => {
          if (color) {
            quantities[color] = (quantities[color] || 0) + 1;
          }
        });
      });
    });
    return quantities;
  }, [templates]);

  const calculateTemplateColorQuantities = useCallback((template: Template) => {
    const quantities: Record<string, number> = {};
    template.grid.forEach((row) => {
      row.forEach((color) => {
        if (color) {
          quantities[color] = (quantities[color] || 0) + 1;
        }
      });
    });
    return quantities;
  }, []);

  // Create a memoized map of template positions for fast lookup
  const templatePositionMap = useMemo(() => {
    const map = new Set<string>();
    templates.forEach((t) => {
      map.add(`${t.x},${t.y}`);
    });
    return map;
  }, [templates]);

  // Memoized function to check if a template exists at a position
  const hasTemplateAt = useCallback(
    (x: number, y: number) => {
      return templatePositionMap.has(`${x},${y}`);
    },
    [templatePositionMap]
  );

  // Check if all templates form a connected component (no orphans)
  const areTemplatesConnected = useCallback((templateSet: Template[]) => {
    if (templateSet.length === 0) return true;
    if (templateSet.length === 1) return true;

    // Create a position set for fast lookup
    const positionSet = new Set<string>();
    templateSet.forEach((t) => {
      positionSet.add(`${t.x},${t.y}`);
    });

    // Start BFS from the first template
    const visited = new Set<string>();
    const queue: [number, number][] = [[templateSet[0].x, templateSet[0].y]];

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (!positionSet.has(key)) continue;

      visited.add(key);

      // Add neighbors to queue
      queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
    }

    // All templates should be visited if they're connected
    return visited.size === templateSet.length;
  }, []);

  // Check if a template can be removed (won't create orphans)
  const canRemoveTemplate = useCallback(
    (templateId: string) => {
      if (templates.length <= 1) return false;

      const remainingTemplates = templates.filter((t) => t.id !== templateId);
      return areTemplatesConnected(remainingTemplates);
    },
    [templates, areTemplatesConnected]
  );

  // Arrange templates in a spatial grid layout (memoized)
  const arrangedTemplates = useMemo((): (Template | null)[][] => {
    if (templates.length === 0) return [];

    // Find min/max x and y to determine grid bounds
    const minX = Math.min(...templates.map((t) => t.x));
    const maxX = Math.max(...templates.map((t) => t.x));
    const minY = Math.min(...templates.map((t) => t.y));
    const maxY = Math.max(...templates.map((t) => t.y));

    // Create a 2D grid to hold templates
    const grid: (Template | null)[][] = [];
    for (let y = minY; y <= maxY; y++) {
      grid[y - minY] = [];
      for (let x = minX; x <= maxX; x++) {
        grid[y - minY][x - minX] = null;
      }
    }

    // Place templates in the grid
    templates.forEach((template) => {
      const gridY = template.y - minY;
      const gridX = template.x - minX;
      if (grid[gridY] && grid[gridY][gridX] === null) {
        grid[gridY][gridX] = template;
      }
    });

    return grid;
  }, [templates]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Find the last template ID to conditionally prevent page break
  const lastTemplateId = useMemo(() => {
    if (templates.length === 0) return null;
    const allTemplates = arrangedTemplates
      .flat()
      .filter((t): t is Template => t !== null);
    return allTemplates.length > 0
      ? allTemplates[allTemplates.length - 1].id
      : null;
  }, [arrangedTemplates, templates.length]);

  const getColorName = useCallback(
    (colorValue: string) => {
      const colorInfo = BEAD_COLORS.find((c) => c.value === colorValue);
      if (colorInfo) return colorInfo.name;

      // Check if it's a custom color
      const customIndex = customColors.findIndex((c) => c === colorValue);
      if (customIndex !== -1) {
        return `Custom ${customIndex + 1}`;
      }

      return "Unknown";
    },
    [customColors]
  );

  const handleCustomColorChange = useCallback(
    (index: number, color: string | null) => {
      setCustomColors((prev) => {
        const newColors = [...prev];
        newColors[index] = color;
        return newColors;
      });
    },
    []
  );

  const handlePaintCanModeToggle = useCallback(() => {
    setPaintCanMode((prev) => !prev);
  }, []);

  const colorQuantities = calculateColorQuantities();
  const sortedColors = Object.entries(colorQuantities)
    .map(([value, count]) => {
      return {
        name: getColorName(value),
        value,
        count,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="main-container min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8 print:bg-white print:bg-none print:p-0">
      <Wrapper>
        <PageHeader />

        <ColorSelector
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          paintCanMode={paintCanMode}
          onPaintCanModeToggle={handlePaintCanModeToggle}
          colorsRow1={BEAD_COLORS_ROW1}
          colorsRow2={BEAD_COLORS_ROW2}
          customColors={customColors}
          onCustomColorChange={handleCustomColorChange}
        />

        <TemplatesHeader
          onPrint={handlePrint}
          showIndividualColors={showIndividualColors}
          showOverallColors={showOverallColors}
          onShowIndividualColorsChange={setShowIndividualColors}
          onShowOverallColorsChange={setShowOverallColors}
          isSingleTemplate={templates.length === 1}
        />
      </Wrapper>
      <div className="print:space-y-0 w-full print:overflow-visible">
        <ScrollArea className="w-full print:hidden">
          <ScrollBar
            orientation="horizontal"
            className="top-0! left-0! right-0!"
          />
          <ScrollBar
            orientation="horizontal"
            className="bottom-0! left-0! right-0!"
          />
          <div className="p-6 flex flex-col items-center">
            {arrangedTemplates.map((row, rowIndex) => {
              return (
                <div
                  key={rowIndex}
                  className="flex items-start justify-center print:block print:justify-center"
                  style={{
                    width: "max-content",
                    minWidth: "100%",
                    gap: "0.25rem",
                  }}
                >
                  {row.map((template, colIndex) => {
                    if (!template) {
                      // Empty cell needs to match template container width exactly
                      // Template structure: outer container padding (12px) + grid (520px) + outer container padding (12px) = 544px
                      // But we need to account for the actual rendered width including the white container
                      // The template-container div itself has no padding, but the inner bg-white div has p-3 (12px)
                      // Grid is 520px, so total content width is 544px
                      // However, we should match the actual template container which includes the white background container
                      return (
                        <div
                          key={`empty-${rowIndex}-${colIndex}`}
                          className="print:hidden"
                          style={{
                            width: "544px",
                            minHeight: 0,
                            flexShrink: 0,
                            boxSizing: "content-box",
                          }}
                        />
                      );
                    }

                    // Check if templates exist in adjacent positions (for plus buttons)
                    const hasTop = hasTemplateAt(template.x, template.y - 1);
                    const hasBottom = hasTemplateAt(template.x, template.y + 1);
                    const hasLeft = hasTemplateAt(template.x - 1, template.y);
                    const hasRight = hasTemplateAt(template.x + 1, template.y);

                    // Check if template can be removed (won't create orphaned templates)
                    const isRemovable = canRemoveTemplate(template.id);

                    return (
                      <div
                        key={template.id}
                        className="template-container print:break-after-page print:break-inside-avoid relative print:w-full print:mb-0"
                        style={{
                          flexShrink: 0,
                          width: "544px",
                          boxSizing: "content-box",
                        }}
                      >
                        <div className="bg-white rounded-lg shadow-xl p-3 print:shadow-none print:p-0 print:bg-transparent relative">
                          {/* Plus buttons positioned absolutely */}
                          {!hasTop && (
                            <button
                              onClick={() => addTemplate("top", template.id)}
                              className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors print:hidden z-20"
                              title="Add template above"
                            >
                              <Plus size={16} className="text-green-600" />
                            </button>
                          )}

                          {!hasBottom && (
                            <button
                              onClick={() => addTemplate("bottom", template.id)}
                              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors print:hidden z-20"
                              title="Add template below"
                            >
                              <Plus size={16} className="text-green-600" />
                            </button>
                          )}

                          {!hasLeft && (
                            <button
                              onClick={() => addTemplate("left", template.id)}
                              className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full border-2 border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors print:hidden z-20"
                              title="Add template to the left"
                            >
                              <Plus size={16} className="text-green-600" />
                            </button>
                          )}

                          {!hasRight && (
                            <button
                              onClick={() => addTemplate("right", template.id)}
                              className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 rounded-full border-2 border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors print:hidden z-20"
                              title="Add template to the right"
                            >
                              <Plus size={16} className="text-green-600" />
                            </button>
                          )}

                          <div className="flex flex-col items-center relative">
                            {/* Remove button - top right, outside grid */}
                            {isRemovable && (
                              <button
                                onClick={() => removeTemplate(template.id)}
                                className="absolute -top-4 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full border-2 border-red-600 flex items-center justify-center transition-colors print:hidden z-20"
                                title="Remove this template"
                              >
                                <X size={14} className="text-white" />
                              </button>
                            )}
                            {/* Clear button - top left, outside grid */}
                            <button
                              onClick={() => clearGrid(template.id)}
                              className="absolute -top-4 -left-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full border-2 border-red-600 flex items-center justify-center transition-colors print:hidden z-20"
                              title="Clear this template"
                            >
                              <Eraser size={14} className="text-white" />
                            </button>
                            <div
                              className="inline-block border-2 border-gray-300 rounded-lg bg-gray-50 print:border-gray-800 grid-container-print relative p-1 print:p-0"
                              onMouseUp={handleMouseUp}
                              onMouseLeave={handleMouseUp}
                            >
                              <div
                                className="grid gap-0.5 print:gap-[0.008in]"
                                style={{
                                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                                  gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                                }}
                              >
                                {template.grid.map((row, rowIndex) =>
                                  row.map((color, colIndex) => {
                                    const isEmpty = !color;
                                    const isWhite = color === "#FFFFFF";

                                    const cellStyle = isEmpty
                                      ? {
                                          backgroundColor: "#FFFFFF",
                                          borderWidth: "1px",
                                          borderStyle: "solid",
                                          borderColor: "#D1D5DB",
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
                                        onMouseDown={() =>
                                          handleMouseDown(
                                            template.id,
                                            rowIndex,
                                            colIndex
                                          )
                                        }
                                        onMouseEnter={() =>
                                          handleMouseEnter(
                                            template.id,
                                            rowIndex,
                                            colIndex
                                          )
                                        }
                                        className={`aspect-square w-4 h-4 rounded-sm cursor-pointer transition-all print:cursor-default hover:ring-1 hover:ring-gray-400 print:hover:ring-0${
                                          isEmpty
                                            ? " bg-white border border-gray-300"
                                            : ""
                                        }`}
                                        style={cellStyle}
                                        title={`Row ${rowIndex + 1}, Col ${
                                          colIndex + 1
                                        }`}
                                      />
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        {/* Print mode - no scroll area */}
        <div className="hidden print:flex print:flex-col print:items-center p-6 print:p-0">
          {arrangedTemplates.map((row, rowIndex) => {
            return (
              <div
                key={rowIndex}
                className="flex items-start justify-center print:block print:justify-center"
                style={{
                  width: "max-content",
                  minWidth: "100%",
                  gap: "0.25rem",
                }}
              >
                {row.map((template, colIndex) => {
                  if (!template) {
                    return (
                      <div
                        key={`empty-${rowIndex}-${colIndex}`}
                        className="print:hidden"
                        style={{
                          width: "544px",
                          minHeight: 0,
                          flexShrink: 0,
                          boxSizing: "content-box",
                        }}
                      />
                    );
                  }

                  const isLastTemplate = lastTemplateId === template.id;
                  const shouldBreakAfterPage =
                    !isLastTemplate || showOverallColors;

                  return (
                    <div
                      key={template.id}
                      className={`template-container print:break-inside-avoid relative print:w-full print:mb-0 ${
                        shouldBreakAfterPage
                          ? "print:break-after-page"
                          : "no-break-after-last"
                      }`}
                      style={{
                        flexShrink: 0,
                        width: "544px",
                        boxSizing: "content-box",
                      }}
                    >
                      <div className="bg-white rounded-lg shadow-xl p-3 print:shadow-none print:p-0 print:bg-transparent relative">
                        <div className="flex flex-col items-center relative">
                          <div className="hidden print:block text-center mb-2 text-sm font-medium text-gray-700">
                            Position: {template.x}:{template.y}
                          </div>
                          <div
                            className="inline-block border-2 border-gray-300 rounded-lg bg-gray-50 print:border-gray-800 grid-container-print relative p-1 print:p-0"
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                          >
                            <div
                              className="grid gap-0.5 print:gap-[0.008in]"
                              style={{
                                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                                gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                              }}
                            >
                              {template.grid.map((row, rowIndex) =>
                                row.map((color, colIndex) => {
                                  const isEmpty = !color;
                                  const isWhite = color === "#FFFFFF";

                                  const cellStyle = isEmpty
                                    ? {
                                        backgroundColor: "#FFFFFF",
                                        borderWidth: "1px",
                                        borderStyle: "solid",
                                        borderColor: "#D1D5DB",
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
                                      className={`aspect-square w-4 h-4 rounded-sm cursor-pointer transition-all print:cursor-default hover:ring-1 hover:ring-gray-400 print:hover:ring-0${
                                        isEmpty
                                          ? " bg-white border border-gray-200"
                                          : ""
                                      }`}
                                      style={cellStyle}
                                      title={`Row ${rowIndex + 1}, Col ${
                                        colIndex + 1
                                      }`}
                                    />
                                  );
                                })
                              )}
                            </div>
                          </div>
                          {templates.length > 1 && (
                            <TemplateMap
                              templates={templates}
                              currentTemplateId={template.id}
                            />
                          )}
                          <TemplateColorQuantities
                            template={template}
                            showIndividualColors={showIndividualColors}
                            calculateTemplateColorQuantities={
                              calculateTemplateColorQuantities
                            }
                            customColors={customColors}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Wrapper className="print:hidden">
        <SaveLoadButtons
          onSave={saveDesign}
          onLoad={loadDesign}
          hasSaved={hasSaved}
          saveMessage={saveMessage}
        />
      </Wrapper>
      {showOverallColors ? (
        <div className="mx-auto max-w-lg print:block hidden print:break-inside-avoid">
          <BeadQuantitiesList
            title="Total bead quantities"
            colors={sortedColors}
          />
        </div>
      ) : null}
      <Wrapper className="print:hidden">
        <Instructions />
      </Wrapper>
    </div>
  );
}
