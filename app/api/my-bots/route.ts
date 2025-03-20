import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { createTextImageAndOverlay } from '../../../utils/createTextAndImageOverlay';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  //const { textCurrent, newImageBuffer } = await createTextImageAndOverlay(curr);
  console.log('***** FLAG 1 *****');
  const { textCurrent, newImageBuffer } = await createTextImageAndOverlay("Hello, World!");
  console.log('***** FLAG 2 *****');
  const base64Image = (newImageBuffer && newImageBuffer.toString('base64')) || '';
  console.log('***** FLAG 3 *****');
  const dataUrl = `data:image/png;base64,${base64Image}`;
  console.log('***** FLAG 4 *****');

  console.log('textCurrent:', textCurrent);
  //console.log('newImageBuffer:', newImageBuffer);
  //console.log('base64Image:', base64Image);
  //console.log('dataUrl:', dataUrl);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Go Back',
          target: `${NEXT_PUBLIC_URL}/api/frame`,
        },
      ],
      image: {
        //src: `${NEXT_PUBLIC_URL}/ETH.png`,
        src: dataUrl,
        aspectRatio: '1:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
