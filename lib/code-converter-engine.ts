// lib/code-converter-engine.ts
export async function convertBetCode(code: string, fromPlatform: string, toPlatform: string) {
  const url = `https://bet-code-converter-api1.p.rapidapi.com/convert?code=${code}&from=${fromPlatform}&to=${toPlatform}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': process.env.RAPIDAPI_HOST || ''
      }
    });
    
    if (!response.ok) throw new Error("Conversion Failed");
    const data = await response.json();
    return data.convertedCode; 
  } catch (e) {
    console.error("Code Converter Error:", e);
    return null;
  }
}
