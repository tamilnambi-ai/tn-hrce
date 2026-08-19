import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount } = (await req.json()) as { amount: number };

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'amount must be ≥ 1' }, { status: 400 });
    }

    const order = await getRazorpay().orders.create({
      amount:   Math.round(amount * 100), // paise
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('[create-order]', err);
    return NextResponse.json({ error: 'order_creation_failed' }, { status: 500 });
  }
}
