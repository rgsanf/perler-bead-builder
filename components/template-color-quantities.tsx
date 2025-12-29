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
}

export function TemplateColorQuantities({
  template,
  showIndividualColors,
  calculateTemplateColorQuantities,
}: TemplateColorQuantitiesProps) {
  if (!showIndividualColors) {
    return null;
  }

  const templateQuantities = calculateTemplateColorQuantities(template);
  const templateSortedColors = Object.entries(templateQuantities)
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
