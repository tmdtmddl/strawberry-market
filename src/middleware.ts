import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { response } from "./lib";
import axios from "axios";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const uid = url.searchParams.get("uid");
  if (!uid) {
    return NextResponse.next();
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken");
  const baseUrl = "http://localhost:3000";
  const next = () => {
    console.log("no access", uid);
    NextResponse.redirect(baseUrl);
  };
  if (!token) {
    return next();
  }
  const idToken = token.value;
  if (!idToken || idToken.length === 0) {
    return next();
  }

  const { data } = await axios.post(process.env.NEXT_PUBLIC_FB_URL!, {
    idToken,
  });
  if (!data || !data.users || data.users.length === 0) {
    return next();
  }
  const foundUser = data.users.find((user: any) => user.localId === uid);
  if (!foundUser) {
    return next();
  }

  return NextResponse.next();
}
