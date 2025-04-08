//! GET => 회원전체

import { authService, dbService, reponse } from "@/lib";

//! POST => 회원 추가

export async function POST(req: Request) {
  const newUser = (await req.json()) as DBUser;

  const { email, password } = newUser;

  try {
    const ref = dbService.collection("users");
    const snap = await ref.where("email", "==", email).get();
    const foundUser = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    if (foundUser.length > 0) {
      return reponse.error("이미 존재하는  회원입니다.");
    }
    const res = await authService.createUserWithEmailAndPassword(
      email,
      password
    );

    if (res.user) {
      const uid = res.user.uid;
      const userRef = ref.doc(uid);

      const user: User = { ...newUser, uid, createdAt: new Date() }; //! password
      //@ts-ignore
      delete user.password;
      await userRef.set(user);
      return reponse.success(user);
    } else {
      return reponse.error("회원가입에 실패했습니다.");
    }
  } catch (error: any) {
    return reponse.error(error.message);
  }
}
