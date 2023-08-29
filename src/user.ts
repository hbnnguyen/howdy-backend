import bcrypt from "bcrypt";
import { prisma } from "./app";
import { UnauthorizedError, NotFoundError } from "./expressError";
import { User } from "@prisma/client";
import config from "./config";
import { UploadController } from "./s3/bucketController";


export async function authenticateUser(email: string, password: string) {
  let user;

  user = await prisma.user.findUniqueOrThrow({
    where: { email: email }
  });

  if (user !== null) {
    // compare hashed password to a new hash from password
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid === true) {
      return user;
    }
  }

  return null;
}

export async function userToUserOutput(user: User): Promise<UserOutput> {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    bio: user.bio,
    imageKey: await getSignedPictureByImageKey(user.imageKey),
  };
}

export async function getSignedPictureByImageKey(imageKey: string): Promise<string> {
  if (imageKey.trim() === "") {
    return ""; //FIXME: DEFAULT IMAGE
  }

  const downloadParams = {
    Bucket: config.bucket_name,
    Key: imageKey, //pass in id here
    Expires: 3600,
    ResponseContentDisposition: `attachment; filename="${imageKey}"`
  };

  const url = UploadController.s3.getSignedUrl('getObject', downloadParams);
  return url;
}


export async function getUserPicture(userId: number): Promise<string> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    return ""; //FIXME: return default image
  }

  return getSignedPictureByImageKey(user.imageKey);
}

export interface UserOutput {
  username: string,
  email: string,
  name: string,
  bio: string,
  imageKey: string,
}