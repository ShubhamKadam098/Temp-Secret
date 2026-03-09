import DeleteDoc from "@/lib/supabase/DeleteDoc";
import FetchDoc from "@/lib/supabase/FetchDoc";
import { FetchFileFromStorage } from "@/lib/supabase/FetchFileFromStorage";
import bcrypt from "bcryptjs";
import DecryptData from "@/lib/DecryptData";
import DeleteStorageFolder from "@/lib/supabase/DeleteStorageFolder";
import { NextRequest, NextResponse } from "next/server";
import {
  consumeRateLimit,
  isRateLimitExceeded,
  secretViewRateLimit,
} from "@/lib/rateLimit";

export const POST = async (request: NextRequest) => {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    try {
      await consumeRateLimit(secretViewRateLimit, ip);
    } catch (error) {
      if (!isRateLimitExceeded(error)) {
        console.error("Rate limiter unavailable during secret fetch:", error);
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

    const { id, password } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const message = await FetchDoc({ docId: id });
    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    if (message.password) {
      if (!password) {
        return NextResponse.json(
          { success: false, message: "Password required" },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, message.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: "Incorrect password" },
          { status: 403 }
        );
      }
    }

    if (message.inputType === "file" && message.filePath) {
      const fileResult = await FetchFileFromStorage({
        filePath: message.filePath,
      });

      if (!fileResult.success || !fileResult.data) {
        return NextResponse.json(
          { success: false, message: "Error fetching file" },
          { status: 500 }
        );
      }

      await DeleteStorageFolder(id);
      await DeleteDoc({ docId: id });

      return NextResponse.json(
        {
          success: true,
          inputType: message.inputType,
          message: fileResult.data,
          contentType: fileResult.contentType,
          fileName: fileResult.fileName,
        },
        { status: 200 }
      );
    }

    if (!message.encryptedContent || !message.iv) {
      return NextResponse.json(
        { success: false, message: "Invalid secret data" },
        { status: 500 }
      );
    }

    const decryptedMessage = await DecryptData({
      iv: message.iv,
      input: message.encryptedContent,
    });

    await DeleteDoc({ docId: id });

    return NextResponse.json(
      {
        success: true,
        inputType: message.inputType,
        message: decryptedMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while retrieving the message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving the message",
      },
      { status: 500 }
    );
  }
};
