import { PrismaClient } from '@prisma/client';
import axios from "axios";
import bcrypt from "bcrypt";
import config from "../src/config";


const HIPSUM_URL = "http://hipsum.co/api/?type=hipster-centric&sentences=1";

function getFriendRadius() {
  return Math.floor(Math.random() * 100);
}

async function getHipSum() {
  const hipsum = await axios.get(HIPSUM_URL);
  return hipsum.data[0];
}

export interface User {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  zipCode: string,
  bio: string,
  hobbies: string,
  interests: string,
  friendRadius: number,
  imageKey: string,
}

const people = [
  { first: "Tucker", last: "D" },
  { first: "Brian", last: "V" },
  { first: "Hannah", last: "N" },
  { first: "Brian", last: "A" },
  { first: "Sarah", last: "S" },
  { first: "Elie", last: "S" },
  { first: "Kadeem", last: "B" },
  { first: "Kenneth", last: "B" },
  { first: "John", last: "C" },
  { first: "Michael", last: "H" },
  { first: "Russell", last: "J" },
  { first: "Meeran", last: "K" },
  { first: "Steven", last: "L" },
  { first: "Ashley", last: "L" },
  { first: "Dylan", last: "L" },
  { first: "Graham", last: "M" },
  { first: "Cindy", last: "P" },
  { first: "Ryan", last: "P" },
  { first: "Camran", last: "R" },
  { first: "Jakob", last: "S" },
  { first: "Tanya", last: "S" },
  { first: "Jonathan", last: "S" },
  { first: "Timothy", last: "S" },
  { first: "Steven", last: "Z" },
];


const prisma = new PrismaClient();
async function main() {

  const hashedPassword = await bcrypt.hash("password", config.BCRYPT_WORK_FACTOR);
  const userPromises = people.map(async (person) => {
    return <User>
      {
        email: `${person.first.toLowerCase()}${person.last.toLowerCase()}@example.com`,
        password: hashedPassword,
        firstName: person.first,
        lastName: person.last,
        zipCode: "94111",
        bio: await getHipSum(),
        hobbies: await getHipSum(),
        interests: await getHipSum(),
        friendRadius: getFriendRadius(),
        imageKey: "defaultProfilePic.jpg"
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