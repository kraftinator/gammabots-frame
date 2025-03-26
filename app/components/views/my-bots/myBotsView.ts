import { createCanvas } from 'canvas';
import { GAMMABOTS_API_KEY, GAMMABOTS_BASE_URL } from '../../../config';

export const myBotsView = async () => {
  const baseUrl = GAMMABOTS_BASE_URL;
  const apiKeyToken = GAMMABOTS_API_KEY;

  const url = `${baseUrl}/bots?apikey=${apiKeyToken}`;

  try {  
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log('Data:', data);
    //console.log('Data:', data[0].token_symbol);
    
    const canvas = createCanvas(256, 417);
    const ctx = canvas.getContext('2d');

    const bgColor = "#1c1e21";
    const textColor = "#ffffff";

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Configure text
    ctx.fillStyle = textColor;
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Set text
    const textCurrent = data[0].token_symbol;
    ctx.fillText(textCurrent, 100, 180);

    const textBuffer = canvas.toBuffer('image/png');

    return textBuffer;
  } catch (error) {
    console.error('Error:', error);
    //return { textCurrent: error, newImageBuffer: textBuffer };
  }
}