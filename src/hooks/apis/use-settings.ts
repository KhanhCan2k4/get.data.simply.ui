import { APP_SETTINGS } from "@/constants/settings.enum";
import { useApi } from "@/hooks/apis/use-api";

export type Setting = {
  id: string;
  key: APP_SETTINGS;
  value: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export function useSettings() {
  const { getAll, getOne, create, edit, remove } = useApi<Setting>({
    endpoint: "/databases/:id/tables",
  });

  getAll.data = [
    {
      id: "id1",
      key: APP_SETTINGS.DATABASES_OVERVIEW,
      value: "chvhd",
      type: "string",
      createdAt: new Date(1759790621106),
      updatedAt: new Date(1759790621106),
    },
    {
      id: "id2",
      key: APP_SETTINGS.MESSAGES_OVERVIEW,
      value: "chvhd",
      type: "string",
      createdAt: new Date(1759790621106),
      updatedAt: new Date(1759790621106),
    },
  ];

  return {
    getAllSettings: getAll,
    getOneSetting: getOne,
    createSetting: create,
    editSetting: edit,
    removeSetting: remove,
  };
}
