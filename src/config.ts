import * as dotenv from 'dotenv';

dotenv.config();

/**
* Config file
*/
const config : {
  port: number,
  access_key_id: string,
  secret_access_key:string,
  bucket_name: string,
  SECRET_KEY: string,
  BCRYPT_WORK_FACTOR: number,
} = {
  port : Number(process.env.PORT) ?? 8080,
  access_key_id : process.env.ACCESS_KEY_ID ?? " ",
  secret_access_key : process.env.SECRET_ACCESS_KEY ?? '',
  bucket_name: process.env.BUCKET_NAME ?? 'test-bucket',
  SECRET_KEY : process.env.SECRET_KEY ?? 'supersecret',
  BCRYPT_WORK_FACTOR: 12,
}

export default config;