import { ROUTERS } from "@/constants/routes";
import { Table } from "@/hooks/apis/use-tables";
import { useLocation, useNavigate } from "react-router-dom";

type DBSideBarItemProps = {
  db: string;
  table: Table;
};

export default function TableSideBarItem({ db, table }: DBSideBarItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = ROUTERS.TABLE_DETAIL.path
    .replace(":database", db)
    .replace(":table", table.name);
  const active = location.pathname.includes(path);
  return (
    <div
      key={table.id}
      className="px-4 py-2 w-full transition-all duration-500 rounded-2xl cursor-pointer hover:bg-gray-50 flex items-center"
      onClick={() => navigate(path)}
    >
      <span className={`flex-1 w-full pr-2 ${active && "underline text-blue-400"}`}>
        {table.name}
      </span>
      <small className="rounded-3xl">{table.columns.length}</small>
    </div>
  );
}
