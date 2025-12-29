import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Printer } from "lucide-react";

interface TemplatesHeaderProps {
  onPrint: () => void;
  showIndividualColors: boolean;
  showOverallColors: boolean;
  onShowIndividualColorsChange: (checked: boolean) => void;
  onShowOverallColorsChange: (checked: boolean) => void;
  isSingleTemplate: boolean;
}

export function TemplatesHeader({
  onPrint,
  showIndividualColors,
  showOverallColors,
  onShowIndividualColorsChange,
  onShowOverallColorsChange,
  isSingleTemplate,
}: TemplatesHeaderProps) {
  return (
    <div className="mb-6 print:hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Design Templates
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <Printer size={18} />
            Print
          </button>
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2">
              <Checkbox
                id="individual-colors"
                checked={showIndividualColors}
                onCheckedChange={(checked) =>
                  onShowIndividualColorsChange(checked === true)
                }
                disabled={isSingleTemplate}
              />
              {isSingleTemplate ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="individual-colors"
                      className="cursor-not-allowed opacity-50"
                    >
                      Template bead quantities
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Total color quantities are the same when there&apos;s only
                      1 template
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Label htmlFor="individual-colors">
                  Template bead quantities
                </Label>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="overall-colors"
                checked={showOverallColors}
                onCheckedChange={(checked) =>
                  onShowOverallColorsChange(checked === true)
                }
              />
              <Label htmlFor="overall-colors">Total bead quantities</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
