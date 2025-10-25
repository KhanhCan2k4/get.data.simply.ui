import { useState, useMemo } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { StatsItem } from "@/routers/database-detail/views/stats-item";
import { Tabs } from "@/routers/database-detail/views/tabs";
import {
  DynamicEditableTable,
  TableColumn,
  TableRow,
} from "@/components/dynamic-editable-table";
import { TableNode } from "@/routers/database-detail/views/table-node";

const mockSchemaData = {
  databaseName: "my_app_db",
  stats: {
    size: "128 MB",
    tableCount: 3,
    encoding: "UTF8",
    collation: "en_US.UTF-8",
  },
  tables: [
    {
      name: "users",
      rowCount: 150,
      columns: [
        { name: "id", dataType: "SERIAL", isPrimaryKey: true },
        { name: "name", dataType: "VARCHAR(100)", isNullable: false },
        { name: "email", dataType: "VARCHAR(255)", isNullable: false },
      ],
    },
    {
      name: "posts",
      rowCount: 850,
      columns: [
        { name: "id", dataType: "SERIAL", isPrimaryKey: true },
        { name: "user_id", dataType: "INT", isForeignKey: true },
        { name: "title", dataType: "VARCHAR(255)", isNullable: false },
        { name: "content", dataType: "TEXT" },
      ],
    },
    {
      name: "comments",
      rowCount: 4200,
      columns: [
        { name: "id", dataType: "SERIAL", isPrimaryKey: true },
        { name: "post_id", dataType: "INT", isForeignKey: true },
        { name: "user_id", dataType: "INT", isForeignKey: true },
        { name: "comment", dataType: "TEXT" },
      ],
    },
  ],
  relationships: [
    {
      sourceTable: "posts",
      sourceColumn: "user_id",
      targetTable: "users",
      targetColumn: "id",
    },
    {
      sourceTable: "comments",
      sourceColumn: "post_id",
      targetTable: "posts",
      targetColumn: "id",
    },
    {
      sourceTable: "comments",
      sourceColumn: "user_id",
      targetTable: "users",
      targetColumn: "id",
    },
  ],
};

const tableOverviewColumns: TableColumn[] = [
  {
    title: "name",
    type: "string",
  },
  {
    title: "row count",
    type: "number",
  },
  {
    title: "columns",
    type: "number",
  },
];

const mockTableOverviewRows: TableRow[] = mockSchemaData.tables.map(
  (table) => ({
    name: table.name,
    "row count": table.rowCount,
    columns: table.columns.length,
  })
);

type Column = {
  name: string;
  dataType: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
};

type Stats = {
  size: string;
  tableCount: number;
  encoding: string;
  collation: string;
};

type Table = { name: string; rowCount: number; columns: Column[] };

type Relationship = {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
};

type SchemaData = {
  databaseName: string;
  stats: Stats;
  tables: Table[];
  relationships: Relationship[];
};

export default function DatabaseDetailPage() {
  const [activeTab, setActiveTab] = useState<"diagram" | "tables">("diagram");

  const schemaData: SchemaData = mockSchemaData;

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!schemaData) return { initialNodes: [], initialEdges: [] };

    const nodes: Node[] = schemaData.tables.map((table, index) => ({
      id: table.name,
      type: "tableNode",
      data: {
        label: table.name,
        columns: table.columns,
      },
      position: { x: (index % 3) * 350, y: Math.floor(index / 3) * 250 },
    }));

    const edges: Edge[] = schemaData.relationships.map((rel, index) => ({
      id: `edge-${index}`,
      source: rel.sourceTable,
      target: rel.targetTable,
      animated: true,
    }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [schemaData]);

  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);

  if (!schemaData) {
    return <div>Loading schema...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        <h2 className="text-xl font-bold mb-2">
          Database:{" "}
          <span className="text-blue-400">{schemaData.databaseName}</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(schemaData.stats).map(([key, value]) => (
            <StatsItem key={key} objKey={key} value={value} />
          ))}
        </div>

        <div className="border-b border-gray-200 mb-6">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div>
          {activeTab === "diagram" && (
            <div className="w-full h-[70vh] bg-white rounded-xl shadow-sm">
              <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          )}
          {activeTab === "tables" && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-xl font-semibold mb-4">
                Tables in{" "}
                <span className="text-blue-400">{schemaData.databaseName}</span>
              </h4>

              <DynamicEditableTable
                columns={tableOverviewColumns}
                data={mockTableOverviewRows}
                readonly
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
