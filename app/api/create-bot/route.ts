import { NextRequest, NextResponse } from 'next/server';
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { parseEther } from 'viem';
import { RECIPIENT_ADDRESS } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  console.log('FLAG 1');
  const body: FrameRequest = await req.json();
  //const body = await req.json();
  //const { isValid, message } = await getFrameMessage(body, {
  //  neynarApiKey: process.env.NEYNAR_API_KEY, // Optional: for validation via Neynar API
  //});
  console.log('FLAG 2');

  /*
  if (!isValid || !message?.input) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid input' }),
      { status: 400 }
    );
  }
    */
  console.log('FLAG 3');
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const recipientAddress = RECIPIENT_ADDRESS;
  const ethAmount = '0.0001';

   let valueInWei: bigint;
   valueInWei = parseEther(ethAmount);

   console.log('FLAG 4');

   // Transaction payload for Base mainnet
  const txData = {
    chainId: 'eip155:8453', // Base mainnet
    method: 'eth_sendTransaction',
    params: {
      to: recipientAddress,
      value: valueInWei.toString(), // Wei as a string
    },
  };
  console.log('FLAG 5');
  console.log('txData:', txData);

  return NextResponse.json(txData);

  // Handle transaction success (if transactionId is present)
  /*
  if (message.transactionId) {
    return new NextResponse(
      getFrameHtmlResponse({
        image: {
          src: 'https://your-hosted-image.com/success.png', // Success image
        },
        buttons: [
          {
            label: `Tx: ${message.transaction.slice(0, 8)}...`,
            action: 'link',
            target: `https://basescan.org/tx/${message.transactionId}`,
          },
        ],
      })
    );

  }
    */
 
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';