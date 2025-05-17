import { NextResponse } from "next/server";
import { s3Client } from "@/lib/aws";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.soltanibucket,
    });
    const data = await s3Client.send(command);
    return NextResponse.json({ files: data.Contents || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}