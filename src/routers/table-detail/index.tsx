import { useState } from "react";
import {
  DynamicEditableTable,
  TableColumn,
  TableRow,
} from "@/components/dynamic-editable-table";

const sampleColumns: TableColumn[] = [
  { title: "id", type: "number" },
  { title: "first_name", type: "string" },
  { title: "is_active", type: "bool" },
  { title: "email", type: "string" },
  { title: "balance", type: "number" },
  { title: "join_date", type: "date" },
  { title: "notes", type: "null" },
];

const sampleData: TableRow[] = [
  {
    id: 1,
    first_name: "John",
    is_active: true,
    email: "john@example.com",
    balance: 150.75,
    join_date: new Date("2024-05-10"),
    notes: "VIP Client",
  },
  {
    id: 2,
    first_name: "Jane",
    is_active: false,
    email: "jane@example.com",
    balance: 2300,
    join_date: new Date("2023-11-20"),
    notes: null,
  },
  {
    id: 3,
    first_name: "Peter",
    is_active: true,
    email: "peter@example.com",
    balance: 0,
    join_date: new Date("2025-01-01"),
    notes: "<null>",
  },
  {
    id: 4,
    first_name: "Susan",
    is_active: true,
    email: "susan@example.com",
    balance: -50.2,
    join_date: new Date("2022-03-15"),
    notes: "Account review needed",
  },
  {
    id: 5,
    first_name: "Michael",
    is_active: false,
    email: null,
    balance: null,
    join_date: null,
    notes: null,
  },
];

export default function TableDetailPage() {
  const [tableData, setTableData] = useState<TableRow[]>(sampleData);

  const handleDataUpdate = (newData: TableRow[]) => {
    console.log("Data was updated in the table component:", newData);
    // You can now save this data to your backend or update parent state
    setTableData(newData);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Editable Data Grid
        </h1>
        <p className="mb-4 text-gray-600">
          Click column headers to sort. Edit any cell directly. Right-click and
          drag to select rows. Type <strong>&lt;null&gt;</strong> to set a cell
          to NULL.
        </p>

        <DynamicEditableTable
          columns={sampleColumns}
          data={tableData}
          onDataChange={handleDataUpdate}
        />

        <div className="mt-8 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Current State Data (Live)</h3>
          <pre className="text-xs max-h-64 overflow-auto">
            <code>
              {JSON.stringify(
                tableData,
                (key, value) => {
                  // Prettier formatting for dates
                  if (key === "join_date" && value) {
                    return new Date(value).toLocaleDateString();
                  }
                  return value;
                },
                2
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
