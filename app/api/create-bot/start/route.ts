// app/api/create-bot/start/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { FrameRequest, getFrameMessage,  getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, GAMMABOTS_API_KEY, GAMMABOTS_BASE_URL } from '../../../config';

async function checkUserSignedUp(fid: number): Promise<boolean> {
  const baseUrl = GAMMABOTS_BASE_URL;
  const apiKeyToken = GAMMABOTS_API_KEY;

  const url = `${baseUrl}/users/${fid}?apikey=${apiKeyToken}`;

  const response = await fetch(url);
  //console.log('Response:', response);

  if (!response.ok) {
    throw new Error('Failed to check user signup status');
  }
  const data = await response.json();
  console.log('Data:', data);
  return data.exists;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('Calling create-bot-success/route.ts');
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  console.log('FLAG A');
  const fid = body.untrustedData.fid;
  console.log('fid:', fid);
  if (!fid) {
    return new NextResponse('No transactionId', { status: 500 });
  }

  console.log('FLAG B');

  //const isSignedUp = await checkUserSignedUp(fid);
  const isSignedUp = false // testing
  
  console.log('FLAG C');
  if (!isSignedUp) {
    console.log('FLAG D');
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Create Account',
            action: 'tx',
            target: `${NEXT_PUBLIC_URL}/api/create-bot/signup`,
            postUrl: `${NEXT_PUBLIC_URL}/api/create-bot/signup`,
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/park-1.png`,
        },
      }),
    );
  }

  console.log('FLAG E');
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Create Bot 2',
          //action: 'tx',
          target: `${NEXT_PUBLIC_URL}/api/create-bot/start`,
        },
        {
          label: 'My Bots',
          target: `${NEXT_PUBLIC_URL}/api/my-bots`,
        },
        {
          label: 'Stats',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';