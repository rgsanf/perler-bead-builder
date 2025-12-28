export function Instructions() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 print:hidden my-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Instructions</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>Select a color from the palette above</li>
        <li>Click on a grid cell to place a bead</li>
        <li>Hold and drag to place multiple beads</li>
        <li>Click on a colored bead to remove it</li>
        <li>
          Use the &quot;Paint Can&quot; tool to fill connected areas of the same
          color
        </li>
        <li>Use &quot;Clear Grid&quot; to start over</li>
      </ul>
    </div>
  );
}
