import { useApi } from "@/hooks/apis/use-api";

export type User = {
  id: string;
  name: string;
  email: string;
};

export function useUsers() {
  const { getAll, getOne, create, edit, remove } = useApi<User>({
    endpoint: "/users",
  });

  return {
    getAllUsers: getAll,
    getOneUser: getOne,
    createUser: create,
    editUser: edit,
    removeUser: remove,
  };
}
