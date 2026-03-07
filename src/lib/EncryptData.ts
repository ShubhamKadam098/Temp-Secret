import crypto from "crypto";
import { env } from "@/env";

const EncryptData = async ({ input }: { input: string }) => {
  try {
    const algorithm = "aes-256-cbc";
    const key = env.ENCRYPTION_KEY;

    if (!key || key.length < 32) {
      console.log("Encryption key must be 32 bytes (256 bits) long");
      throw new Error("Encryption key must be 32 bytes (256 bits) long");
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key.slice(0, 32)), iv);
    let encryptData = cipher.update(input, "utf-8", "hex");
    encryptData += cipher.final("hex");

    // Convert iv to base64
    const base64data = iv.toString("base64");

    return { encryptData, iv: base64data };
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null;
  }
};

export default EncryptData;
