import { NextRequest, NextResponse } from 'next/server';
import { FrameRequest, getFrameMessage,  getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, GAMMABOTS_API_KEY, GAMMABOTS_BASE_URL } from '../../../config';

async function createAccountWithSignature(fid: number, signature: string, address: string) {
  const apikey = GAMMABOTS_API_KEY;
  
  const response = await fetch(`${GAMMABOTS_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fid, address, signature, apikey }),
  });
  const data = await response.json();

  console.log('data:', data);

  return data;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('Calling signup/route.ts');
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  console.log('body', body);
  console.log('message:', message);

  const fid = body.untrustedData.fid;
  console.log('fid:', fid);
  if (!fid) {
    return new NextResponse('No transactionId', { status: 500 });
  }

  const signature = body.untrustedData.transactionId;
  console.log('signature:', signature);

  if (signature) {
    try {
      const address = message.address // || body.untrustedData.address;
      if (!address) {
        return new NextResponse('No address', { status: 500 });
      }
      console.log('address:', address);
      const botWallet = await createAccountWithSignature(fid, signature, address);
      console.log('botWallet:', botWallet);

      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: 'Account created!',
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/park-1.png`,
          },
        }),
      );
    } catch (error) {
      console.error('Signature verification failed:', error);
      return new NextResponse('Signature verification failed', { status: 500 });
    }
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