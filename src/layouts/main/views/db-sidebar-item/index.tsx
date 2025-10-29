import {
  AddIcon,
  DatabaseIcon,
  DownIcon,
  MySQLIcon,
  PostgresIcon,
  UpIcon,
} from "@/components/icon";
import { ROUTERS } from "@/constants/routes";
import { DB } from "@/hooks/apis/use-dbs";
import NavbarItem from "@/layouts/main/views/navbar-item";
import { useLocation, useNavigate } from "react-router-dom";
import TableSideBarItem from "@/layouts/main/views/table-sider-item";
import { useMemo, useState } from "react";

type DBSideBarItemProps = {
  db: DB;
  open: boolean;
};

export default function DBSideBarItem({
  db,
  open,
  ...props
}: DBSideBarItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openTableList, setOpenTableList] = useState(false);
  const path = ROUTERS.DATABASE_DETAIL.path.replace(":database", db.name);
  const createTablePath = ROUTERS.TABLE_CREATE.path.replace(
    ":database",
    db.name
  );
  const active = location.pathname.includes(path);

  const icon = useMemo(() => {
    switch (db.type) {
      case "mysql":
        return <MySQLIcon className="size-5 text-purple-600" />;
      case "postgres":
        return <PostgresIcon className="size-5 text-blue-600" />;
      default:
        return <DatabaseIcon className="size-5 text-gray-600" />;
    }
  }, [db.type]);
  return (
    <>
      <div
        className={
          props.onClick &&
          `${active && "bg-gray-50"} gap-4 hover:bg-gray-50 flex pl-4`
        }
      >
        {props.onClick &&
          (openTableList ? (
            <UpIcon
              className="size-4 self-center text-gray-400"
              onClick={() => setOpenTableList((prev) => !prev)}
            />
          ) : (
            <DownIcon
              className="size-4 self-center text-gray-400"
              onClick={() => setOpenTableList((prev) => !prev)}
            />
          ))}
        <NavbarItem
          key={db.id}
          open={open}
          icon={icon}
          path={path}
          displayName={db.name}
          {...props}
        />
      </div>

      {open && openTableList && (
        <div className="w-full p-4 pt-2 flex flex-col gap-2">
          <div
            onClick={() => navigate(createTablePath)}
            className="p-2 flex flex-row text-sm text-blue-400 items-center justify-center gap-2 shadow-sm rounded-full cursor-pointer hover:bg-blue-400 hover:text-white"
          >
            <AddIcon className="size-4" />
            <span>Add new table</span>
          </div>
          {db.tables.length > 0 ? (
            db.tables.map((table) => (
              <TableSideBarItem db={db.name} key={table.id} table={table} />
            ))
          ) : (
            <small>
              <i>There is no tables to display</i>
            </small>
          )}
        </div>
      )}
    </>
  );
}
