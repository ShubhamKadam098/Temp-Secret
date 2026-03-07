import DeleteDoc from "@/lib/supabase/DeleteDoc";
import FetchDoc from "@/lib/supabase/FetchDoc";
import { FetchFileFromStorage } from "@/lib/supabase/FetchFileFromStorage";
import bcrypt from "bcryptjs";
import DecryptData from "@/lib/DecryptData";
import DeleteStorageFolder from "@/lib/supabase/DeleteStorageFolder";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { id, password } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    // Fetch the document from the database  
    const message = await FetchDoc({ docId: id });
    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    // Check if the message has already been visited
    if (message.isVisited) {
      await DeleteDoc({ docId: id });
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    // Validate password if required
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

    let responseData: string;
    let contentType: string | undefined;
    let fileName: string | undefined;

    // Handle file type - fetch from storage and convert to base64
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

      // Return file data as base64 with metadata
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

    // Handle text/link - decrypt normally
    const decryptedMessage = await DecryptData({
      iv: message.iv,
      input: message.input,
    });

    // Delete the message after it is viewed
    await DeleteDoc({ docId: id });

    // Respond with the decrypted message
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
