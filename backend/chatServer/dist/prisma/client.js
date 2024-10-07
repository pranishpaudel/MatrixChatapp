var _a;
import { PrismaClient } from "@prisma/client";
const prismaClientSingleton = () => {
    return new PrismaClient();
};
const prismaClientForChat = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaClientSingleton();
export default prismaClientForChat;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prismaClientForChat;
