import { useApi } from "@/hooks/apis/use-api";
import { User } from "@/hooks/apis/use-users";
import { Message } from "@/hooks/apis/use-messages";

export type Receiver = User & Message;

export function useReceivers() {
  const { getAll, getOne, create, edit, remove } = useApi<Receiver>({
    endpoint: "/messages/receivers",
  });

  getAll.data = [
    {
      id: "u1",
      name: "User Number 1",
      email: "user1@example.com",
      content: "Hihi",
      createdAt: new Date(1759790621106),
      isRead: false,
      receiver: {
        id: "u1",
      } as User,
      updatedAt: new Date(1759790621106),
    },
    {
      id: "u2",
      name: "User Number 2",
      content: "Hihi",
      createdAt: new Date(1759090631106),
      isRead: true,
      receiver: {
        id: "u2",
      } as User,
      email: "user1@example.com",
      updatedAt: new Date(1759090631106),
    },
  ];

  return {
    getAllReceivers: getAll,
    getOneReceiver: getOne,
    createReceiver: create,
    editReceiver: edit,
    removeReceiver: remove,
  };
}
