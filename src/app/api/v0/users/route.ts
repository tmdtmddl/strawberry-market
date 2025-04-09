//! GET => 회원 전체

import { authService, dbService, response } from "@/lib";

//! POST => 회원 추가
export async function POST(req: Request) {
  const newUser = (await req.json()) as DBUser;
  const { email, password } = newUser;

  const ref = dbService.collection("users");

  try {
    const snap = await ref.where("email", "==", email).get();

    const foundUser = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    if (foundUser.length > 0) {
      return response.error("이미 존재하는 회원입니다.");
    }

    const res = await authService.createUserWithEmailAndPassword(
      email,
      password
    );
    if (!res.user) {
      return response.error("회원가입에 실패했습니다.");
    }
    const uid = res.user.uid;
    const userRef = ref.doc(uid);
    const user: User = { ...newUser, uid, createdAt: new Date() }; //! password

    //@ts-ignore
    delete user.password;

    await userRef.set(user);

    return response.success(user);
  } catch (error: any) {
    return response.error(error.message);
  }
}
