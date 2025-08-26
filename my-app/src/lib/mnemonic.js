import { generateMnemonic } from "bip39";
import CryptoJS from "crypto-js";

export function newMnemonic() {
  return generateMnemonic(); // 12 words
}

export function encryptMnemonic(mnemonic, password) {
  return CryptoJS.AES.encrypt(mnemonic, password).toString();
}

export function decryptMnemonic(ciphertext, password) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);

  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  return originalText;
}
