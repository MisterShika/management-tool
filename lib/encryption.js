import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secret = Buffer.from(process.env.TEMP_ENCRYPTION_KEY, "hex"); // must be 32 bytes (64 hex chars)

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // store iv + tag + encrypted together
  return Buffer.concat([iv, tag, encrypted]).toString("hex");
}

export function decrypt(encryptedHex) {
  if (!encryptedHex) throw new Error("Empty value to decrypt");

  const data = Buffer.from(encryptedHex, "hex");
  const iv = data.slice(0, 16);
  const tag = data.slice(16, 32);
  const encrypted = data.slice(32);

  const decipher = crypto.createDecipheriv(algorithm, secret, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
