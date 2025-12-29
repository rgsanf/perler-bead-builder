interface ColorInfo {
  name: string;
  value: string;
  count: number;
}

interface BeadQuantitiesListProps {
  title: string;
  colors: ColorInfo[];
  className?: string;
}

export function BeadQuantitiesList({
  title,
  colors,
  className = "",
}: BeadQuantitiesListProps) {
  return (
    <div className={`print:break-inside-avoid ${className}`}>
      <h3 className="text-sm font-semibold mb-2 text-gray-700 print:text-xs">
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 print:grid-cols-3">
        {colors.map(({ name, value, count }) => (
          <div key={value} className="flex items-center gap-2 print:gap-1">
            <div
              className="w-6 h-6 rounded border-2 border-gray-300 print:w-5 print:h-5 shrink-0"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800 print:text-xs">
                {name}
              </div>
              <div className="text-xs text-gray-600 print:text-[10px]">
                {count} bead
                {count !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

