import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// We derive a 32-byte key from JWT_SECRET or a fallback.
// In a real production app, you'd want a separate ENCRYPTION_KEY that is strictly 32 bytes.
const getSecretKey = (): Buffer => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod';
    return crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, 32) as unknown as Buffer;
};

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(12);
    const key = getSecretKey();
    
    // The key must be a Buffer for createCipheriv
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}
