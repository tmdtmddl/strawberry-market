import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export default async function noUserMiddleware(req: NextRequest) {
  //! 유저라면 되돌려주기

  const cookieStore = await cookies();
  const token = cookieStore.get("idToken");
  console.log("유저 토큰을 검사합니다.");
  if (!token) {
    console.log("유저가 아닙니다.");
    return NextResponse.next();
  }
  const idToken = token.value;
  console.log("아이디토큰을 검사합니다.");
  if (!idToken || idToken.length === 0) {
    console.log("유저가 아닙니다.");
    return NextResponse.next();
  }

  //! 안됨
  console.log("유저입니다. 돌아가세요!");
  return NextResponse.redirect(
    new URL(
      "/",
      req.url ||
        req.nextUrl.host ||
        process.env.HOST_URL ||
        "http://localhost:3000"
    )
  );
}
