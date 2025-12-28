interface ColorQuantity {
  name: string;
  value: string;
  count: number;
}

interface ColorQuantitiesProps {
  colors: ColorQuantity[];
}

export function ColorQuantities({ colors }: ColorQuantitiesProps) {
  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 print:shadow-none print:p-4 print:break-inside-avoid">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 print:text-lg">
        Color Quantities
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 print:grid-cols-3">
        {colors.map(({ name, value, count }) => (
          <div key={value} className="flex items-center gap-3 print:gap-2">
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
  );
}
