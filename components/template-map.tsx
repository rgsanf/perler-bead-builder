import { Square, SquareCheck } from "lucide-react";

interface Template {
  id: string;
  grid: string[][];
  x: number;
  y: number;
}

interface TemplateMapProps {
  templates: Template[];
  currentTemplateId: string;
}

export function TemplateMap({
  templates,
  currentTemplateId,
}: TemplateMapProps) {
  const getGridBounds = () => {
    if (templates.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const minX = Math.min(...templates.map((t) => t.x));
    const maxX = Math.max(...templates.map((t) => t.x));
    const minY = Math.min(...templates.map((t) => t.y));
    const maxY = Math.max(...templates.map((t) => t.y));
    return { minX, maxX, minY, maxY };
  };

  const { minX, maxX, minY, maxY } = getGridBounds();
  const rows = [];

  for (let y = minY; y <= maxY; y++) {
    const cols = [];
    for (let x = minX; x <= maxX; x++) {
      const templateAtPos = templates.find((t) => t.x === x && t.y === y);
      const isCurrent = templateAtPos?.id === currentTemplateId;
      cols.push(
        <div key={`${x}-${y}`} className="flex items-center justify-center">
          {isCurrent ? (
            <SquareCheck size={12} className="text-gray-800" />
          ) : templateAtPos ? (
            <Square size={12} className="text-gray-400" />
          ) : (
            <div className="w-3 h-3" />
          )}
        </div>
      );
    }
    rows.push(
      <div key={y} className="flex gap-1">
        {cols}
      </div>
    );
  }

  return (
    <div className="template-map mt-4 pt-12">
      <div className="text-xs text-gray-600 mb-2 text-center">Template Map</div>
      <div className="flex flex-col items-center gap-1">{rows}</div>
    </div>
  );
}
