import prisma from "@/prisma/prisma.config";

async function getUserDataFromPrisma(
  idOrEmail: string,
  data: string | string[]
): Promise<any> {
  const isEmail = idOrEmail.includes("@");
  const user = await prisma.user.findUnique({
    where: isEmail ? { email: idOrEmail } : { id: idOrEmail },
    select: Array.isArray(data)
      ? data.reduce((obj, field) => ({ ...obj, [field]: true }), {})
      : { [data]: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export default getUserDataFromPrisma;
