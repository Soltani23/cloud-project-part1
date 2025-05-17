import { NextResponse } from "next/server";
import { s3Client } from "@/lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const profileImage = formData.get("profileImage");

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let imageUrl = "";
  if (profileImage) {
    const fileName = `${Date.now()}-${profileImage.name}`;
    const command = new PutObjectCommand({
      Bucket: process.env.soltanibucket,
      Key: fileName,
      Body: await profileImage.arrayBuffer(),
      ContentType: profileImage.type,
    });
    await s3Client.send(command);
    imageUrl = `https://${process.env.soltanibucketE}.s3.amazonaws.com/${fileName}`;
  }

  const user = await prisma.user.create({
    data: { firstName, lastName, email, profileImage: imageUrl },
  });
  return NextResponse.json({ message: "User created", user });
}