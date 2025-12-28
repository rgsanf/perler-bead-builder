import { Printer } from "lucide-react";

interface TemplatesHeaderProps {
  onPrint: () => void;
}

export function TemplatesHeader({ onPrint }: TemplatesHeaderProps) {
  return (
    <div className="mb-6 print:hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Design Templates
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
