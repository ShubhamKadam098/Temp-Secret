import DeleteDoc from "@/lib/firebase/DeleteDoc";
import FetchDoc from "@/lib/firebase/FetchDoc";
import bcrypt from "bcryptjs";
import DecryptData from "@/lib/DecryptData";
import DeleteStorageFolder from "@/lib/firebase/DeleteStorageFolder";
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

    // Decrypt the message
    const decryptedMessage = await DecryptData({
      iv: message.iv,
      input: message.input,
    });

    // Delete the message after it is viewed
    if (message.inputType === "file") {
      // await DeleteStorageFolder(id);
    }
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
