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
  { first: "Tucker", last: "Diane" },
  { first: "Brian", last: "Voter" },
  { first: "Hannah", last: "Nguyen" },
  { first: "Brian", last: "Aston" },
  { first: "Sarah", last: "Stockton" },
  { first: "Elie", last: "Shoppick" },
  { first: "Kadeem", last: "Best" },
  { first: "Kenneth", last: "Burgher" },
  { first: "John", last: "Chong" },
  { first: "Michael", last: "Herman" },
  { first: "Russell", last: "Jones" },
  { first: "Meeran", last: "Kim" },
  { first: "Steven", last: "Lee" },
  { first: "Ashley", last: "Lin" },
  { first: "Dylan", last: "Lowes" },
  { first: "Graham", last: "Macfarquhar" },
  { first: "Cindy", last: "Pan" },
  { first: "Ryan", last: "Park" },
  { first: "Camran", last: "Rynowecer" },
  { first: "Jakob", last: "Shavinski" },
  { first: "Tanya", last: "Shylock" },
  { first: "Jonathan", last: "Stern" },
  { first: "Timothy", last: "Sukamtoh" },
  { first: "Steven", last: "Zheng" },
];


const prisma = new PrismaClient();
async function main() {

  const hashedPassword = await bcrypt.hash("password", config.BCRYPT_WORK_FACTOR);
  const userPromises = people.map(async (person) => {
    return <User>
      {
        email: `${person.first}${person.last}@example.com`,
        password: hashedPassword,
        firstName: person.first,
        lastName: person.last,
        zipCode: "94111",
        bio: await getHipSum(),
        hobbies: await getHipSum(),
        interests: await getHipSum(),
        friendRadius: getFriendRadius(),
        imageKey: "d9bc889a-3d46-4a36-8fe7-258274941166.jpg"
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