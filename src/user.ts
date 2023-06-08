import { prisma } from "./app";

function authenticateUser(username: string, password: string) {

  const user = prisma.user.findFirst;

}