import axios from "axios";

const HIPSUM_URL = "http://hipsum.co/api/?type=hipster-centric&sentences=1";

function getFriendRadius() {
  return Math.floor(Math.random() * 100);
}

async function getHipSum() {
  const hipsum: string = await axios.get(HIPSUM_URL);
  return hipsum;
}

export interface User {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  zipCode: string,
  bio: string | null,
  hobbies: string | null,
  interests: string | null,
  friendRadius: number | null;
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

const users = people.map(async (person) => {
  return <User>
    {
      email: `${person.first}${person.last}@example.com`,
      password: "password",
      firstName: person.first,
      lastName: person.last,
      zipCode: "94111",
      bio: await getHipSum(),
      hobbies: await getHipSum(),
      interests: await getHipSum(),
      friendRadius: getFriendRadius()
    };
});

console.log(users);