import { S3 } from 'aws-sdk';
import checkBucket from './checkBucket';
import config from "./config";

/**
  * @name initBucket
  * @returns {void}
*/
async function initBucket (s3: S3) {
  const bucketStatus = await checkBucket(s3, config.bucket_name);

  if (!bucketStatus.success) { // check if the bucket don't exist
    // let bucket = await createBucket(s3); // create new bucket
    console.log("failed bucket name:", config.bucket_name);
  }
}

export { initBucket };