import { useApi } from "@/hooks/apis/use-api";
import { User } from "@/hooks/apis/use-users";

export type Message = {
  id: string;
  receiver: User;
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
      receiver: { id: "u1" } as User,
      content: "Here is the message",
      createdAt: new Date(1759090631106),
      updatedAt: new Date(1759090631106),
      isRead: false,
    },
    {
      id: "id3",
      receiver: { id: "uid1" } as User,
      content:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, fuga optio consectetur error nesciunt excepturi adipisci eligendi! Veritatis temporibus deleniti asperiores eius, perferendis quasi ut, perspiciatis, dolor voluptate atque velit.",
      createdAt: new Date(1758080631106),
      updatedAt: new Date(1758080631106),
      isRead: true,
    },
    {
      id: "id2",
      receiver: { id: "u2" } as User,
      content: "Here is the message",
      createdAt: new Date(1759060631106),
      updatedAt: new Date(1759060631106),
      isRead: false,
    },
    {
      id: "id4",
      receiver: { id: "uid1" } as User,
      content: "Did you check the latest update? It’s looking great so far!",
      createdAt: new Date(1759099631106),
      updatedAt: new Date(1759099631106),
      isRead: true,
    },
    {
      id: "id5",
      receiver: { id: "u3" } as User,
      content: "Okay, I’ll send you the files later today.",
      createdAt: new Date(1759092631106),
      updatedAt: new Date(1759092631106),
      isRead: false,
    },
    {
      id: "id6",
      receiver: { id: "uid1" } as User,
      content: "Sure, let’s meet at 10 AM tomorrow!",
      createdAt: new Date(1759070631106),
      updatedAt: new Date(1759070631106),
      isRead: false,
    },
    {
      id: "id7",
      receiver: { id: "u4" } as User,
      content: "Please confirm the schedule when you have time.",
      createdAt: new Date(1759097631106),
      updatedAt: new Date(1759097631106),
      isRead: true,
    },
    {
      id: "id8",
      receiver: { id: "uid1" } as User,
      content: "Thanks for your help! Everything works now.",
      createdAt: new Date(1759100631106),
      updatedAt: new Date(1759100631106),
      isRead: true,
    },
    {
      id: "id9",
      receiver: { id: "uid1" } as User,
      content: "Good bye",
      createdAt: new Date(1759100631106),
      updatedAt: new Date(1759100631106),
      isRead: true,
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
