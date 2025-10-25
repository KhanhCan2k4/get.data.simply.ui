import { useApi } from "@/hooks/apis/use-api";
import { Table } from "@/hooks/apis/use-tables";

export interface DB {
  id: string;
  name: string;
  tables: Table[];
  sizeMB: number;
  type: "postgres" | "mysql";
  createdAt: Date;
}

export function useDBs() {
  const { getAll, getOne, create, edit, remove } = useApi<DB>({
    endpoint: "/databases",
  });

  getAll.data = [
    {
      id: "id1",
      name: "db1",
      sizeMB: 1200,
      type: "postgres",
      createdAt: new Date(),
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
      sizeMB: 850,
      type: "mysql",
      createdAt: new Date(),
    },
    {
      id: "id3",
      name: "db3",
      tables: [],
      sizeMB: 430,
      type: "postgres",
      createdAt: new Date(),
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
