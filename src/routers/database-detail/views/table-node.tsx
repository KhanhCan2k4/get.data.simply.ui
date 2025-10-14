import { KeyIcon, LinkIcon } from "@/components/icon";
import { Column } from "@/routers/table-create/table-create.types";
import { Handle, Position } from "reactflow";

type TableNodeProps = {
  data: { label: string; columns: Column[] };
};

export function TableNode({ data }: TableNodeProps) {
  return (
    <div className="bg-white rounded-lg shadow-md w-64 p-1">
      <div className="bg-gray-50 pb-2 pt-3 rounded-t-lg text-center border-b-1 border-b-gray-300">
        <strong className="text-blue-500">{data.label}</strong>
      </div>
      <div className="p-2 space-y-1 text-sm">
        {data.columns.map((col, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>
              {col.isPrimaryKey && <KeyIcon className="size-4 inline mr-1 text-yellow-500" />}
              {col.isForeignKey && <LinkIcon className="size-4 inline mr-1 text-gray-500" />}
              {col.name}
            </span>
            <span className="text-gray-500 font-mono">{col.dataType}</span>
          </div>
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-400"
      />
      <Handle type="target" position={Position.Left} className="!bg-blue-400" />
    </div>
  );
}
