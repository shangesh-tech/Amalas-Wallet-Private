import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { newMnemonic, encryptMnemonic } from '@/lib/mnemonic';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();
  
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }
  
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  if (user.encryptedMnemonic) {
    return NextResponse.json({ error: 'Wallet already exists' }, { status: 400 });
  }

  // Generate, encrypt, and save mnemonic
  const mnemonic = newMnemonic();
  user.encryptedMnemonic = encryptMnemonic(mnemonic, password);
  await user.save();

  return NextResponse.json({ message: 'Wallet created successfully' });
}