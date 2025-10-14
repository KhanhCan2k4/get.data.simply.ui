import { TrashIcon } from "@/components/icon";
import { useState, useMemo } from "react";
import { DATA_TYPES } from "./table-create.constants";
import { Column } from "@/routers/table-create/table-create.types";
import SqlEditor from "@/components/sql-editor";

export default function TableCreatePage() {
  const [tableName, setTableName] = useState("");
  const [dbType, setDbType] = useState<"mysql" | "postgres">("postgres");
  const [columns, setColumns] = useState<Column[]>([
    {
      id: Date.now(),
      name: "id",
      dataType: "SERIAL",
      length: "",
      defaultValue: "",
      isNullable: false,
      isPrimaryKey: true,
      isAutoIncrement: true,
    },
  ]);

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now(),
      name: "",
      dataType: dbType === "mysql" ? "INT" : "INT",
      length: "",
      defaultValue: "",
      isNullable: true,
      isPrimaryKey: false,
      isAutoIncrement: false,
    };
    setColumns([...columns, newColumn]);
  };

  const removeColumn = (id: number) => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  const handleColumnChange = (id: number, field: keyof Column, value: any) => {
    setColumns(
      columns.map((col) => {
        if (col.id === id) {
          if (field === "isPrimaryKey" && value === true) {
            columns.forEach((c) => {
              if (c.id !== id) c.isPrimaryKey = false;
            });
            return { ...col, isPrimaryKey: true, isNullable: false };
          }
          if (field === "isNullable" && col.isPrimaryKey) {
            return col;
          }
          return { ...col, [field]: value };
        }
        return col;
      })
    );
  };

  const generatedSql = useMemo(() => {
    if (!tableName.trim()) return "/* Please enter a table name */";

    const q = dbType === "mysql" ? "`" : '"';
    let sql = `CREATE TABLE ${q}${tableName}${q} (\n`;

    const columnDefs = columns
      .map((col) => {
        if (!col.name.trim() || !col.dataType) return null;

        let def = `  ${q}${col.name}${q} ${col.dataType}`;
        if (
          col.length &&
          ["VARCHAR", "DECIMAL"].includes(col.dataType.toUpperCase())
        ) {
          def += `(${col.length})`;
        }
        if (col.isPrimaryKey && dbType === "mysql") {
          // For simplicity, handle PK inline for MySQL sometimes
          // In a real app, PRIMARY KEY constraint at the end is more robust
        }
        if (!col.isNullable) {
          def += " NOT NULL";
        }
        if (
          col.isAutoIncrement &&
          dbType === "mysql" &&
          col.dataType.toUpperCase() === "INT"
        ) {
          def += " AUTO_INCREMENT";
        }
        if (col.defaultValue.trim()) {
          def += ` DEFAULT '${col.defaultValue.replace(/'/g, "''")}'`; // Basic quoting
        }
        return def;
      })
      .filter(Boolean);

    const primaryKeys = columns
      .filter((c) => c.isPrimaryKey)
      .map((c) => `${q}${c.name}${q}`);
    if (primaryKeys.length > 0) {
      columnDefs.push(`  PRIMARY KEY (${primaryKeys.join(", ")})`);
    }

    sql += columnDefs.join(",\n");
    sql += "\n);";
    return sql;
  }, [columns, tableName, dbType]);

  const handleSubmit = () => {
    console.log({ tableName, columns, dbType });
    alert("Check the console for the form data that would be sent to the API.");
  };

  return (
    <div className="bg-gray-100 p-4 h-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Table
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tableName"
                className="block text-sm font-medium text-gray-700"
              >
                Table Name
              </label>
              <input
                type="text"
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="e.g., users"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dbType"
                className="block text-sm font-medium text-gray-700"
              >
                Database System
              </label>
              <select
                id="dbType"
                value={dbType}
                onChange={(e) => setDbType(e.target.value as any)}
                className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Columns</h2>
          <div className="overflow-x-auto">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1">Length</div>
                <div className="col-span-2">Default</div>
                <div className="col-span-3">Options</div>
                <div className="col-span-1"></div>
              </div>
              <div className="space-y-2 py-2">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="grid grid-cols-12 gap-4 px-4 py-2 items-center rounded-md hover:bg-gray-50"
                  >
                    <div className="col-span-12 md:col-span-3">
                      <input
                        type="text"
                        placeholder="column_name"
                        value={col.name}
                        onChange={(e) =>
                          handleColumnChange(col.id, "name", e.target.value)
                        }
                        className="w-full form-input outline-0"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <select
                        value={col.dataType}
                        onChange={(e) =>
                          handleColumnChange(col.id, "dataType", e.target.value)
                        }
                        className="w-full form-select outline-0"
                      >
                        <option value="">--Type--</option>
                        {DATA_TYPES[dbType].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-12 md:col-span-1">
                      <input
                        type="text"
                        placeholder="e.g. 255"
                        value={col.length}
                        onChange={(e) =>
                          handleColumnChange(col.id, "length", e.target.value)
                        }
                        className="w-full form-input outline-0"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <input
                        type="text"
                        placeholder="Default value"
                        value={col.defaultValue}
                        onChange={(e) =>
                          handleColumnChange(
                            col.id,
                            "defaultValue",
                            e.target.value
                          )
                        }
                        className="w-full form-input outline-0"
                      />
                    </div>
                    <div className="col-span-10 md:col-span-3 flex items-center space-x-4 text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!col.isNullable}
                          onChange={(e) =>
                            handleColumnChange(
                              col.id,
                              "isNullable",
                              !e.target.checked
                            )
                          }
                          className="form-checkbox"
                        />{" "}
                        <span className="ml-1">Not Null</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={col.isPrimaryKey}
                          onChange={(e) =>
                            handleColumnChange(
                              col.id,
                              "isPrimaryKey",
                              e.target.checked
                            )
                          }
                          className="form-checkbox"
                        />{" "}
                        <span className="ml-1">PK</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={col.isAutoIncrement}
                          onChange={(e) =>
                            handleColumnChange(
                              col.id,
                              "isAutoIncrement",
                              e.target.checked
                            )
                          }
                          className="form-checkbox"
                        />{" "}
                        <span className="ml-1">AI</span>
                      </label>
                    </div>
                    <div className="col-span-2 md:col-span-1 text-right">
                      <button
                        onClick={() => removeColumn(col.id)}
                        className="text-gray-400 hover:text-red-400 p-1 rounded-full"
                      >
                        <TrashIcon className="size-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={addColumn}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200"
          >
            + Add Column
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            SQL Preview
          </h2>
          <div className="h-[300px]">
            <SqlEditor defaultSql={generatedSql} canType={false} />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 bg-blue-400 text-white font-bold rounded-lg text-lg hover:bg-blue-500 transition-colors shadow-lg"
        >
          Create Table
        </button>
      </div>
    </div>
  );
}
