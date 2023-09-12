import { PrismaClient } from '@prisma/client';
import axios from "axios";
import bcrypt from "bcrypt";
import config from "../src/config";


const HIPSUM_URL = "http://hipsum.co/api/?type=hipster-centric&sentences=1";

async function getHipSum() {
  const hipsum = await axios.get(HIPSUM_URL);
  return hipsum.data[0];
}

export interface User {
  id: number,
  username: string
  email: string,
  password: string,
  name: string,
  bio: string,
  friendRadius: number,
  imageKey: string,
}

const people = [
  { name: "TuckerDiane" },
  { name: "Test1" },
  { name: "Test2" },
];


const prisma = new PrismaClient();
async function main() {

  const hashedPassword = await bcrypt.hash("password", config.BCRYPT_WORK_FACTOR);
  const userPromises = people.map(async (person) => {
    return <User>
      {
        username: person.name.toLocaleLowerCase(),
        email: `${person.name.toLowerCase()}@example.com`,
        password: hashedPassword,
        name: person.name,
        bio: await getHipSum(),
        imageKey: "defaultPfp.jpg"
      };
  });

  const users = await Promise.all(userPromises);

  // console.log(users[0]);

  // prisma.user.create({ data: users[0] });

  await prisma.user.createMany({ data: users });
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })