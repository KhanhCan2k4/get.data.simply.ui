import {
  CalendarIcon,
  FileIcon,
  InfoIcon,
  MySQLIcon,
  PostgresIcon,
} from "@/components/icon";
import { ROUTERS } from "@/constants/routes";
import { DB } from "@/hooks/apis/use-dbs";
import { formatSize } from "@/utils/format-size";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

type DatabaseCardProps = {
  db: DB;
};

export function DatabaseCard({ db }: DatabaseCardProps) {
  const navigate = useNavigate();

  const handleOpenDB = () => {
    const dbPath = ROUTERS.DATABASE_DETAIL.path.replace(":database", db.id);
    navigate(dbPath);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col">
      <div className="p-4 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            {db.type === "postgres" ? (
              <PostgresIcon className="size-6 text-blue-800" />
            ) : (
              <MySQLIcon className="size-8 text-purple-500" />
            )}
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {db.name}
            </h3>
          </div>
          <div className="flex gap-2 items-center text-xs text-gray-500 mt-1">
            <CalendarIcon className="size-5" />{" "}
            {dayjs(new Date(db.createdAt)).fromNow()}
          </div>
          <div className="flex gap-2 items-center text-xs text-gray-500 mt-1">
            <FileIcon className="size-5" /> {db.tables.length} tables of{" "}
            {formatSize(db.sizeMB)}
          </div>
        </div>

        <InfoIcon className="size-6 cursor-pointer" onClick={handleOpenDB} />
      </div>
    </div>
  );
}
