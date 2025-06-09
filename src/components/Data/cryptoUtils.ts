// src/utils/cryptoUtils.ts
export async function sha256(message: string): Promise<string> {
  // Encode string menjadi Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // Hash data dengan SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert ArrayBuffer ke hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}