import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query, Mutation, Profile } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query, Mutation, Profile },
  context: async ({ req }): Promise<Context> => {
    const userInfo = await getUserFromToken(
      req.headers.authorization as string
    );
    return { prisma, userInfo };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready on ${url}`);
});
