type TabsProps = {
  activeTab: "tables" | "diagram";
  setActiveTab: (tab: "tables" | "diagram") => void;
};

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
      <button
        onClick={() => setActiveTab("diagram")}
        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === "diagram"
            ? "border-blue-300 text-blue-400"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        Schema Diagram
      </button>
      <button
        onClick={() => setActiveTab("tables")}
        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === "tables"
            ? "border-blue-300 text-blue-400"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        Tables
      </button>
    </nav>
  );
}
