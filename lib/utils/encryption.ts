import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'fallback-secret-key-for-development';

export function encryptData(data: string): string {
    try {
        const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
        return encodeURIComponent(encrypted);
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

export function decryptData(encryptedData: string): string {
    try {
        const decodedData = decodeURIComponent(encryptedData);
        const decrypted = CryptoJS.AES.decrypt(decodedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}
