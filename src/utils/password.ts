const crypto = require('crypto');

export function encryptPassword(password: string) {
  const algorithm = 'aes-256-ctr';
  const secret = process.env.ENCRYPTION_SECRET;

  const cipher = crypto.createCipher(algorithm, secret);
  const encryptedPassword =
    cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

  return encryptedPassword;
}

export function decryptPassword(encryptedPassword: string) {
  const algorithm = 'aes-256-ctr';
  const secret = process.env.ENCRYPTION_SECRET;

  const decipher = crypto.createDecipher(algorithm, secret);
  const decryptedPassword =
    decipher.update(encryptedPassword, 'hex', 'utf8') + decipher.final('utf8');

  return decryptedPassword;
}
