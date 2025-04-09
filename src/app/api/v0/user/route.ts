import { dbService, response } from "@/lib";
import { cookies } from "next/headers";

//! GET => user 정보 가져오는 곳
export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return response.error("아이디 토큰을 전달해주세요.");
  }
  const idToken = authorization.split(" ")[1];
  if (!idToken || idToken.length === 0) {
    return response.error("아이디 토큰을 확인해주세요.");
  }
  const cookieStore = await cookies();
  cookieStore.set("idToken", idToken);
  //! cookieStore.get('idToken').value

  const uid = new URL(req.url).searchParams.get("uid");

  if (!uid) {
    return response.error("유저 아이디를 전달해주세요.");
  }
  try {
    const snap = await dbService.collection("users").doc(uid).get();
    const user = snap.data() as User;

    return response.success(user);
  } catch (error: any) {
    return response.error(error.message);
  }
}

//! POST => login // nono // cookie 삭제하는 곳
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("idToken");
  return response.success("id token bye-bye");
}

//! PATCH => user 정보 수정하는 곳

//! DELETE => user 탈퇴 곳
