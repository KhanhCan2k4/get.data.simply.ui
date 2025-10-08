import { useApi } from "@/hooks/apis/use-api";

export type Table = {
  id: string;
  name: string;
  columns: { name: string; type: string }[];
};

export function useTables() {
  const { getAll, getOne, create, edit, remove } = useApi<Table>({
    endpoint: "/databases/:id/tables",
  });

  getAll.data = [
    {
      id: "id1",
      name: "Db1",
      columns: [],
    },
  ];

  return {
    getAllTables: getAll,
    getOneTable: getOne,
    createTable: create,
    editTable: edit,
    removeTable: remove,
  };
}
