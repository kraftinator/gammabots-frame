import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('Calling create-bot-success/route.ts');
  const body: FrameRequest = await req.json();
  console.log('body', body);
  console.log('body?.untrestedData', body?.untrustedData);
  console.log('body.untrustedData.transactionId', body.untrustedData.transactionId);
  console.log('body?.untrustedData?.transactionId', body?.untrustedData?.transactionId);

  const { isValid } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Tx: ${body?.untrustedData?.transactionId || '--'}`,
          target: `${NEXT_PUBLIC_URL}/api/frame`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-4.png`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
