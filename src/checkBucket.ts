import { S3 } from "aws-sdk";
/**
  * @name checkBucket
  * @param {S3} s3
  * @returns {Promise<{success:boolean; message: string; data:string;}>}
*/
async function checkBucket (s3: S3, bucket:string) {
  try {
    const res =  await s3.headBucket({Bucket: bucket}).promise()

    console.log("Bucket already Exist", res.$response.data);

    return { success: true, message: "Bucket already Exist",data: {}};
  } catch (error) {

    console.log("Error bucket don't exsit", error);

    return { success: false, message: "Error bucket don't exsit",data: error };
  }
};

export default checkBucket;