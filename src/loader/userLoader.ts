import { User } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "../index";

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (ids) => {
  console.log(ids);
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  const userMap: { [key: string]: User } = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => userMap[id]);
};

// [1,3,2]

// [{id: 2},{id: 1},{id: 3}]

// {
//   1: {id: 1},
//   2: {id: 2},
//   3: {id: 3}
// }

// @ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);
