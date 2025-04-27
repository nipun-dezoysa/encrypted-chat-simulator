import CryptoJS from "crypto-js";

const derivedKey = (key) =>
  CryptoJS.SHA256(key).toString(CryptoJS.enc.Base64).substr(0, 32);

export function encrypt(text, secret, ivHex) {
  const key = CryptoJS.enc.Utf8.parse(derivedKey(secret));
  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

export function decrypt(cipherText, secret, ivHex) {
  const key = CryptoJS.enc.Utf8.parse(derivedKey(secret));
  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export const generateIV = () => {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
};
