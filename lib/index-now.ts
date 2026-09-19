export async function pingIndexNow(url: string) {
  const host = 'mivaj.com';
  // Use a generated 32-character hex key. Mivaj must host this key at https://mivaj.com/mivaj-indexnow-key.txt
  const key = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
  
  try {
    const res = await fetch(`https://www.bing.com/indexnow?url=${url}&key=${key}`, { method: 'GET' });
    if (res.ok) console.log(`[IndexNow] Successfully pinged: ${url}`);
  } catch (err) {
    console.error(`[IndexNow] Failed to ping ${url}`, err);
  }
}
