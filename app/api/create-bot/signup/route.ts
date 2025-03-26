import { NextRequest, NextResponse } from 'next/server';
import { FrameRequest, getFrameMessage,  getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from '../../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('Calling signup/route.ts');
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const fid = body.untrustedData.fid;
  console.log('fid:', fid);
  if (!fid) {
    return new NextResponse('No transactionId', { status: 500 });
  }

  const txData = {
    chainId: 'eip155:8453', // Base mainnet
    method: 'eth_signTypedData_v4',
    params: {
      domain: { name: 'Gammabots', chainId: 8453, version: '1' },
      types: { Signup: [{ name: 'fid', type: 'uint256' }] },
      primaryType: 'Signup',
      message: { fid },
    },
  };

  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';