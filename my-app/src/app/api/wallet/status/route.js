import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { auth } from '@/auth';

export async function GET(req) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ hasWallet: false }, { status: 200 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  if (user?.encryptedMnemonic) {
    return NextResponse.json({ hasWallet: true }, { status: 200 });
  } else {
    return NextResponse.json({ hasWallet: false }, { status: 200 });
  }
}