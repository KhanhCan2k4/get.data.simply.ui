import React, { useState, useMemo, useEffect } from "react";
import { SortIcon } from "@/components/icon";

export type ColumnType = "string" | "number" | "bool" | "date" | "null";

export interface TableColumn {
  title: string;
  type: ColumnType;
}

export type TableRow = Record<string, string | number | boolean | Date | null>;

type SortDirection = "ascending" | "descending";

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface DynamicEditableTableProps {
  columns: TableColumn[];
  data: TableRow[];
  onDataChange?: (newData: TableRow[]) => void;
  readonly?: boolean;
}

export function DynamicEditableTable({
  columns,
  data,
  onDataChange,
  readonly = false,
}: DynamicEditableTableProps) {
  const [internalData, setInternalData] = useState<TableRow[]>(data);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartRow, setDragStartRow] = useState<number | null>(null);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  const handleDataChange = (newData: TableRow[]) => {
    setInternalData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleCellChange = (
    rowIndex: number,
    columnKey: string,
    value: any
  ) => {
    const columnType = columns.find((c) => c.title === columnKey)?.type;
    let convertedValue = value;

    if (value === "<null>") {
      convertedValue = null;
    } else {
      switch (columnType) {
        case "number":
          convertedValue = value === "" ? null : parseFloat(value);
          if (isNaN(convertedValue)) convertedValue = null;
          break;
        case "bool":
          // The value is already a boolean from the checkbox
          break;
        case "date":
          convertedValue = value ? new Date(value) : null;
          break;
        default: // string or null type
          convertedValue = value;
          break;
      }
    }

    const newData = [...internalData];
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: convertedValue };
    handleDataChange(newData);
  };

  const sortedData = useMemo(() => {
    let sortableData = [...internalData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Always place nulls at the bottom
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (aVal < bVal) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [internalData, sortConfig]);

  const requestSort = (key: string) => {
    let direction: SortDirection = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLTableRowElement>,
    rowIndex: number
  ) => {
    if (e.button === 2) {
      e.preventDefault();
      setIsDragging(true);
      setDragStartRow(rowIndex);
      setSelectedRows(new Set([rowIndex]));
    }
  };

  const handleMouseEnter = (rowIndex: number) => {
    if (isDragging && dragStartRow !== null) {
      const newSelectedRows = new Set<number>();
      const start = Math.min(dragStartRow, rowIndex);
      const end = Math.max(dragStartRow, rowIndex);
      for (let i = start; i <= end; i++) {
        newSelectedRows.add(i);
      }
      setSelectedRows(newSelectedRows);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartRow(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const renderCellInput = (
    row: TableRow,
    rowIndex: number,
    column: TableColumn
  ) => {
    const value = row[column.title];

    switch (column.type) {
      case "bool":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) =>
              handleCellChange(rowIndex, column.title, e.target.checked)
            }
            className="mx-auto block form-checkbox px-4 py-2 outline-0 text"
            readOnly={readonly}
          />
        );
      case "date":
        const dateValue =
          value instanceof Date ? value.toISOString().split("T")[0] : "";
        return (
          <input
            type="date"
            value={dateValue}
            onChange={(e) =>
              handleCellChange(rowIndex, column.title, e.target.value)
            }
            className="w-full bg-transparent py-2 px-4 form-input outline-0"
            readOnly={readonly}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value === null ? "" : String(value)}
            onChange={(e) =>
              handleCellChange(rowIndex, column.title, e.target.value)
            }
            className="w-full bg-transparent py-2 px-4 text-right form-input outline-0"
            readOnly={readonly}
          />
        );
      case "string":
      case "null":
      default:
        return (
          <input
            type="text"
            value={value === null ? "" : String(value)}
            onChange={(e) =>
              handleCellChange(rowIndex, column.title, e.target.value)
            }
            className="w-full bg-transparent py-2 px-4 form-input outline-0"
            readOnly={readonly}
          />
        );
    }
  };

  return (
    <div
      className="overflow-x-auto bg-white p-4 rounded-lg shadow-sm"
      onContextMenu={(e) => e.preventDefault()}
    >
      <table className="min-w-full divide-y divide-gray-200 border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.title}
                onClick={() => requestSort(col.title)}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
              >
                <div className="flex items-center justify-between">
                  <span>{col.title}</span>
                  <SortIcon className="text-gray-400 size-3" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition-colors ${
                selectedRows.has(rowIndex) ? "bg-blue-100" : "hover:bg-gray-50"
              }`}
              onMouseDown={(e) => handleMouseDown(e, rowIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex)}
            >
              {columns.map((col) => (
                <td key={col.title} className="p-0 whitespace-nowrap">
                  {renderCellInput(row, rowIndex, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
