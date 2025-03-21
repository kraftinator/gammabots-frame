import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

export const myBots = async () => {
  try {
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
    const textCurrent = "Greetings, World!";
    ctx.fillText(textCurrent, 100, 180);

    const textBuffer = canvas.toBuffer('image/png');

    //return { newImageBuffer: textBuffer }
    //return { textCurrent, newImageBuffer: textBuffer };
    return textBuffer;
  } catch (error) {
    console.error('Error:', error);
    //return { textCurrent: error, newImageBuffer: textBuffer };
  }
}