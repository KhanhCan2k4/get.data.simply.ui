import { useApi } from "@/hooks/apis/use-api";
import { User } from "@/hooks/apis/use-users";
import { DB } from "@/hooks/apis/use-dbs";

export type Message = {
  id: string;
  sender: User;
  database: DB;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
};

export function useMessages() {
  const { getAll, getOne, create, edit, remove } = useApi<Message>({
    endpoint: "/messages",
  });

  getAll.data = [
    {
      id: "id1",
      sender: { id: "u1", name: "Fake user" } as User,
      content: "Here is the message",
      createdAt: new Date(1759090631106),
      updatedAt: new Date(1759090631106),
      isRead: false,
      database: { id: "db1" } as DB,
    },
    {
      id: "id3",
      sender: { id: "uid1", name: "Fake user" } as User,
      content:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, fuga optio consectetur error nesciunt excepturi adipisci eligendi! Veritatis temporibus deleniti asperiores eius, perferendis quasi ut, perspiciatis, dolor voluptate atque velit.",
      createdAt: new Date(1758080631106),
      updatedAt: new Date(1758080631106),
      isRead: true,
      database: { id: "db1" } as DB,
    },
    {
      id: "id2",
      sender: { id: "u2", name: "Fake user" } as User,
      content: "Here is the message",
      createdAt: new Date(1759060631106),
      updatedAt: new Date(1759060631106),
      isRead: false,
      database: { id: "db1" } as DB,
    },
    {
      id: "id4",
      sender: { id: "uid1", name: "Fake user" } as User,
      content: "Did you check the latest update? It’s looking great so far!",
      createdAt: new Date(1759099631106),
      updatedAt: new Date(1759099631106),
      isRead: true,
      database: { id: "db1" } as DB,
    },
    {
      id: "id5",
      sender: { id: "u3", name: "Fake user" } as User,
      content: "Okay, I’ll send you the files later today.",
      createdAt: new Date(1759092631106),
      updatedAt: new Date(1759092631106),
      isRead: false,
      database: { id: "db1" } as DB,
    },
    {
      id: "id6",
      sender: { id: "uid1", name: "Fake user" } as User,
      content: "Sure, let’s meet at 10 AM tomorrow!",
      createdAt: new Date(1759070631106),
      updatedAt: new Date(1759070631106),
      isRead: false,
      database: { id: "db1" } as DB,
    },
    {
      id: "id7",
      sender: { id: "u4", name: "Fake user" } as User,
      content: "Please confirm the schedule when you have time.",
      createdAt: new Date(1759097631106),
      updatedAt: new Date(1759097631106),
      isRead: true,
      database: { id: "db1" } as DB,
    },
    {
      id: "id8",
      sender: { id: "uid1", name: "Fake user" } as User,
      content: "Thanks for your help! Everything works now.",
      createdAt: new Date(1759100631106),
      updatedAt: new Date(1759100631106),
      isRead: true,
      database: { id: "db1" } as DB,
    },
    {
      id: "id9",
      sender: { id: "uid1", name: "Fake user" } as User,
      content: "Good bye",
      createdAt: new Date(1759100631106),
      updatedAt: new Date(1759100631106),
      isRead: true,
      database: { id: "db1" } as DB,
    },
  ];

  return {
    getAllMessages: getAll,
    getOneMessage: getOne,
    createMessage: create,
    editMessage: edit,
    removeMessage: remove,
  };
}
