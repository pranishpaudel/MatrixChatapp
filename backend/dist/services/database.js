var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prismaClientForChat from "../prisma/client";
export function getGroupMembers(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        const group = yield prismaClientForChat.group.findUnique({
            where: {
                id: groupId,
            },
            select: {
                members: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!group) {
            throw new Error("Group not found");
        }
        return group.members.map((member) => member.id);
    });
}
