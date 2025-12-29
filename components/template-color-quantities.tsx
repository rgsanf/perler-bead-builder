import { BEAD_COLORS } from "@/lib/perler-bead.constants";
import { BeadQuantitiesList } from "./bead-quantities-list";

interface Template {
  id: string;
  grid: string[][];
  x: number;
  y: number;
}

interface TemplateColorQuantitiesProps {
  template: Template;
  showIndividualColors: boolean;
  calculateTemplateColorQuantities: (
    template: Template
  ) => Record<string, number>;
  customColors: (string | null)[];
}

export function TemplateColorQuantities({
  template,
  showIndividualColors,
  calculateTemplateColorQuantities,
  customColors,
}: TemplateColorQuantitiesProps) {
  if (!showIndividualColors) {
    return null;
  }

  const getColorName = (colorValue: string) => {
    const colorInfo = BEAD_COLORS.find((c) => c.value === colorValue);
    if (colorInfo) return colorInfo.name;

    // Check if it's a custom color
    const customIndex = customColors.findIndex((c) => c === colorValue);
    if (customIndex !== -1) {
      return `Custom ${customIndex + 1}`;
    }

    return "Unknown";
  };

  const templateQuantities = calculateTemplateColorQuantities(template);
  const templateSortedColors = Object.entries(templateQuantities)
    .map(([value, count]) => {
      return {
        name: getColorName(value),
        value,
        count,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="mt-4 print:block">
      {showIndividualColors && (
        <BeadQuantitiesList
          title="Template bead quantities"
          colors={templateSortedColors}
        />
      )}
    </div>
  );
}
