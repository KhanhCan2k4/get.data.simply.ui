import { useApi } from "@/hooks/apis/use-api";
import { Table } from "@/hooks/apis/use-tables";

export type DB = {
  id: string;
  name: string;
  tables: Table[];
};

export function useDBs() {
  const { getAll, getOne, create, edit, remove } = useApi<DB>({
    endpoint: "/databases",
  });

  getAll.data = [
    {
      id: "id1",
      name: "db1",
      tables: [
        {
          id: "t1",
          name: "learning_sentences",
          columns: [],
        },
         {
          id: "t2",
          name: "pets",
          columns: [],
        },
      ],
    },
    {
      id: "id2",
      name: "db2",
      tables: [],
    },
    {
      id: "id3",
      name: "db3",
      tables: [],
    },
  ];

  return {
    getAllDBs: getAll,
    getOneDB: getOne,
    createDB: create,
    editDB: edit,
    removeDB: remove,
  };
}
