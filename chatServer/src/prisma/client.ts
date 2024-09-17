import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaClientForChat = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prismaClientForChat;

if (process.env.NODE_ENV !== "production")
  globalThis.prismaGlobal = prismaClientForChat;
