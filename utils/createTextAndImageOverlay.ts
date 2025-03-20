import { createCanvas, registerFont } from 'canvas';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
//import { Currency } from './enums';

export const createTextImageAndOverlay = async (currency: string) => {
  //const apiKeyToken = process.env.ETHERSCAN;
  //const url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKeyToken}`;

  try {
    //const response = await fetch(url);
    //if (!response.ok) {
    //  throw new Error(`Error: ${response.status}`);
    //}
    //const data = await response.json();

    const textCurrent = currency // === Currency.USD ? data.result.ethusd : data.result.ethbtc;

    const canvas = createCanvas(256, 417);
    const ctx = canvas.getContext('2d');

    registerFont(path.resolve('./public/fonts/Montserrat-BoldItalic.ttf'), {
      family: 'Montserrat-BoldItalic',
    });

    ctx.fillStyle = '#FDFD96';
    ctx.font = '48px Montserrat';
    ctx.fillText(textCurrent, 10, 180);

    const textBuffer = canvas.toBuffer('image/png');

    const ethImagePath = path.resolve('./public/ETH.png');

    const ethImageBuffer = fs.readFileSync(ethImagePath);

    const newImageBuffer = await sharp(ethImageBuffer)
      .composite([{ input: textBuffer }])
      .toBuffer();

    return { textCurrent, newImageBuffer };
    //return { textCurrent, newImageBuffer: textBuffer };
  } catch (error) {
    console.error('Error:', error);
    const ethImagePath = path.resolve('./public/ETH.png');
    return { textCurrent: error, ethImagePath: ethImagePath };
  }
};
