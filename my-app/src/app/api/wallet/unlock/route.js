import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { User } from "@/lib/models/User";
import { auth } from "@/auth";
import { decryptMnemonic } from "@/lib/mnemonic";
import { HDNodeWallet } from "ethers";

export async function POST(req) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    );
  }

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user || !user.encryptedMnemonic) {
    return NextResponse.json(
      { error: "No wallet found for this user" },
      { status: 404 }
    );
  }

  try {
    // Decrypt the mnemonic on the server-side
    const mnemonic = decryptMnemonic(user.encryptedMnemonic, password);

    if (mnemonic) {
      return NextResponse.json(
        { name: user.firstname, mnemonic },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error });
  }
}
