import AddDoc from "@/lib/supabase/AddDoc";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AddSecretPayload } from "@/types/api";
import { inputType } from "@/types/inputTypes";
import EncryptData from "@/lib/EncryptData";
import generateRandomId from "@/lib/GenerateRandomId";
import { AddFileToStorage } from "@/lib/supabase/AddFileToStorage";
import { env } from "@/env";
import {
  consumeRateLimit,
  isRateLimitExceeded,
  publicRateLimit,
} from "@/lib/rateLimit";
import { serverSupabase } from "@/Supabase/serverClient";

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];

export const POST = async (request: NextRequest) => {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    try {
      await consumeRateLimit(publicRateLimit, ip);
    } catch (error) {
      if (!isRateLimitExceeded(error)) {
        console.error("Rate limiter unavailable during secret creation:", error);
        return NextResponse.json(
          { success: false, message: "Service temporarily unavailable" },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const inputType = formData.get("inputType") as inputType;
    let input: string | File | null = null;

    if (inputType === "file") {
      input = formData.get("file") as File;
    } else {
      input = formData.get("input") as string;
    }

    let password = formData.get("password") as string;
    const id = generateRandomId();

    if (!input || !["file", "text", "link"].includes(inputType)) {
      return NextResponse.json(
        { success: false, message: "Invalid request format or request" },
        { status: 400 }
      );
    }

    let filePath: string | undefined;
    let contentType: string | undefined;
    let encryptedContent: string | undefined;
    let iv: string | undefined;

    if (inputType === "file") {
      if (!(input instanceof File)) {
        return NextResponse.json(
          { success: false, message: "No file provided" },
          { status: 400 }
        );
      }

      if (input.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: `File size exceeds ${MAX_FILE_SIZE_MB}MB`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(input.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file type. Only images and PDFs are allowed",
          },
          { status: 400 }
        );
      }

      const uploadResponse = await AddFileToStorage({ supabase: serverSupabase, input, id });
      if (!uploadResponse.success || !uploadResponse.filePath) {
        return NextResponse.json(
          { success: false, message: "Error while uploading file" },
          { status: 500 }
        );
      }

      filePath = uploadResponse.filePath;
      contentType = input.type;
    } else if (typeof input === "string") {
      const encryptionResult = await EncryptData({ input });
      encryptedContent = encryptionResult?.encryptData;
      iv = encryptionResult?.iv;

      if (!encryptedContent || !iv) {
        console.error("Error while encrypting data");
        throw new Error("Error while creating link");
      }
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const payLoad: AddSecretPayload = {
      inputType,
      encryptedContent: encryptedContent || undefined,
      iv: iv || undefined,
      filePath,
      contentType,
      password: password || undefined,
    };

    const response = await AddDoc({ supabase: serverSupabase, id, payLoad });
    if (!response) {
      throw new Error("Error while creating link");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Link created successfully",
        link: `${env.NEXT_PUBLIC_BASE_URL}/secret/${id}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.json(
      { success: false, message: "Error while creating link" },
      { status: 500 }
    );
  }
};
