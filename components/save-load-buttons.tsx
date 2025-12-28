import { Download, Save } from "lucide-react";

interface SaveLoadButtonsProps {
  onSave: () => void;
  onLoad: () => void;
  hasSaved: boolean;
  saveMessage: string;
}

export function SaveLoadButtons({
  onSave,
  onLoad,
  hasSaved,
  saveMessage,
}: SaveLoadButtonsProps) {
  return (
    <div className="flex justify-end my-4 print:hidden">
      <div className="flex gap-2 items-center">
        {saveMessage && (
          <span
            className={`text-sm font-medium ${
              saveMessage.includes("Failed") ? "text-red-600" : "text-green-600"
            }`}
          >
            {saveMessage}
          </span>
        )}
        <button
          onClick={onSave}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          title="Save design to browser storage"
        >
          <Save size={18} />
          Save
        </button>
        <button
          onClick={onLoad}
          className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
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
  );
}
