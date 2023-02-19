import CryptoJS from 'crypto-js';

export const encrypt = (token: string) => {
  const encrypted = CryptoJS.AES.encrypt(token, import.meta.env.VITE_CRYPTO_KEY).toString();
  localStorage.setItem('encryptedSpotifyToken', encrypted);
  return encrypted;
};

export const getSpotifyTokenLocalStorage = () => {
  const encrypted = localStorage.getItem('encryptedSpotifyToken') as string;
  if (encrypted === null) {
    return null;
  }
  const decrypted = CryptoJS.AES.decrypt(encrypted, import.meta.env.VITE_CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
  return decrypted;
};
