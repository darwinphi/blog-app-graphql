import { Context } from "../index";
import { userLoader } from "../loader/userLoader";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: (parent: PostParentType, __: any, { prisma }: Context) => {
    return userLoader.load(parent.authorId);
  },
};
