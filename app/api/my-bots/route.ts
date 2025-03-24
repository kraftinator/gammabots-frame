import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { myBotsView } from '../../components/views/my-bots/myBotsView';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const textBuffer = await myBotsView();
  const base64Image = (textBuffer && textBuffer.toString('base64')) || '';
  const dataUrl = `data:image/png;base64,${base64Image}`;
  
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
