import AddDoc from "@/lib/firebase/AddDoc";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { addDocPayload } from "@/types/AddDocPayload";
import EncryptData from "@/lib/EncryptData";
import generateRandomId from "@/lib/GenerateRandomId";
import { AddFileToStorage } from "@/lib/firebase/AddFileToStorage";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const inputType = formData.get("inputType") as string;
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

    if (inputType === "file") {
      if (!(input instanceof File)) {
        return NextResponse.json(
          { success: false, message: "No file provided" },
          { status: 400 }
        );
      }

      // Validate file size
      if (input.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: `File size exceeds ${MAX_FILE_SIZE_MB}MB`,
          },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(input.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file type. Only images and PDFs are allowed",
          },
          { status: 400 }
        );
      }

      const uploadResponse = await AddFileToStorage({ input, id });
      if (!uploadResponse.success || !uploadResponse.url) {
        return NextResponse.json(
          { success: false, message: "Error while uploading file" },
          { status: 500 }
        );
      }

      input = uploadResponse.url;
    }

    // Hash the password if provided
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    // Encrypt the input if it's a string
    let encryptedData: string | undefined;
    let iv: string | undefined;
    if (typeof input === "string") {
      const encryptionResult = await EncryptData({ input });
      encryptedData = encryptionResult?.encryptData;
      iv = encryptionResult?.iv;

      if (!encryptedData || !iv) {
        console.error("Error while encrypting data");
        throw new Error("Error while creating link");
      }
    }

    const payLoad: addDocPayload = {
      inputType,
      iv: iv as string,
      input: encryptedData as string,
      isVisited: false,
      password,
    };

    const response = await AddDoc({ id, payLoad });
    if (!response) {
      throw new Error("Error while creating link");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Link created successfully",
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/secret/${id}`,
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
