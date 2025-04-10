import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('Calling frame/route.ts');
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  /*
  const text = message.input || '';
  let state = {
    page: 0,
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }
  *

  /**
   * Use this code to redirect to a different page
   */
  /*
  if (message?.button === 3) {
    return NextResponse.redirect(
      'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
      { status: 302 },
    );
  }
  */

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Create Bot',
          //action: 'tx',
          target: `${NEXT_PUBLIC_URL}/api/create-bot/start`,
          //target: `${NEXT_PUBLIC_URL}/api/create-bot`,
          //postUrl: `${NEXT_PUBLIC_URL}/api/create-bot-success`,
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
      //postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      //state: {
      //  page: state?.page + 1,
      //  time: new Date().toISOString(),
      //},
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
