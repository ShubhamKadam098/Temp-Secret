import crypto from "crypto";

const DecryptData = async ({ iv, input }: { iv: string; input: string }) => {
  try {
    const algorithm = "aes-256-cbc";
    const key = process.env.ENCRYPTION_KEY;

    if (!key || key.length !== 32) {
      throw new Error("Encryption key must be 32 bytes (256 bits) long");
    }

    const ivBuffer = Buffer.from(iv, "base64");
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key),
      ivBuffer
    );
    let decryptedData = decipher.update(input, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

export default DecryptData;
