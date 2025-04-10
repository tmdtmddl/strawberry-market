import { dbService, response } from "@/lib";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

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

  //req.url=>들어온 요청의 전체 URL을 의미
  //new URL(req.url)=> 문자열로 된 URL을 분석해서 쓸 수 있게 만들어주는 객체로 바꾸는 것
  //들어온 요청 URL에서 uid라는 이름의 값을 꺼내서 uid 변수에 저장하는 것
  const uid = new URL(req.url).searchParams.get("uid");

  if (!uid) {
    return response.error("유저 아이디를 전달해주세요.");
  }
  try {
    //snap은 "문서 전체" , user는 그 안에 있는 실제 유저 데이터만!
    //Firestore에서 문서를 가져온 전체 결과	"문서 파일 통째로 들고 온 거"
    const snap = await dbService.collection("users").doc(uid).get();
    //snap.data()	그 문서 안에 있는 실제 데이터만 꺼낸 것	"파일 안 내용만 꺼냄"
    //user	데이터 꺼내서 User 타입으로 지정한 변수	"이제 화면에 쓸 수 있는 사용자 정보"
    //snap 안에 있는 문서에서 진짜 실제 데이터만 꺼내서 user라는 변수에 담는 거예요.
    const user = snap.data() as User;
    //reponse.success(user)	Firestore에서 가져온 user 데이터를 JSON 형태로 성공 응답으로 보냄
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
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  console.log(data, 52);
  const auth = req.headers.get("authorization");
  if (!auth) {
    return response.error("no");
  }
  const uid = auth?.split(" ")[1];
  if (!uid) {
    return response.error("no");
  }
  const { target, value } = data as { target: keyof User; value: any };

  const ref = dbService.collection("users").doc(uid);
  // try {
  //   await ref.update();
  // } catch (error:any) {
  //   return response.error(error.message)
  // }
}

//! DELETE => user 탈퇴 곳
