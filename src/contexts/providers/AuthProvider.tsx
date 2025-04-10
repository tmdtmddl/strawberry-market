"use client";

import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";
import { AUTH } from "../react.context";
import { authService, dbService, FBCollection } from "@/app/lib";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(AUTH.initialState.user);
  const [isPending, startTransition] = useTransition();

  const ref = useMemo(() => dbService.collection(FBCollection.USERS), []);

  const signin = useCallback(
    (email: string, password: string) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            const { user } = await authService.signInWithEmailAndPassword(
              email,
              password
            );
            if (!user) {
              resolve({
                success: false,
                message: "알 수 없는 이유로 데이터를 가져오는에 실패했습니다.",
              });
            }
            const snap = await ref.doc(user.uid).get();
            const data = snap.data() as User;
            if (!data) {
              return resolve({
                message:
                  "존재하지않는 유저입니다.다시한번 더 회원가입 해주세요.",
              });
            }
            setUser(data); //! 데이터베이스에서 가져온 유저
            resolve({ success: true });
          } catch (error: any) {
            resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  const signout = useCallback(
    () =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            await authService.signOut();
            setUser(null);
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );

  const signup = useCallback(
    (newUser: User & { password: string }) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            //! 인증할때 회원가입
            const { user } = await authService.createUserWithEmailAndPassword(
              newUser.email,
              newUser.password
            );
            if (!user) {
              return resolve({ message: "회원가입에 실패했습니다." });
            }
            //! 회원가입정보를 데이터베이스 저장
            //@ts-ignore
            delete newUser.password;
            const storedUser: User = { ...newUser };
            console.log(storedUser);

            //@ts-ignore
            delete newUser.password;
            await ref.doc(user.uid || storedUser.uid).set(storedUser);

            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );

  const updateAll = useCallback(
    (updateUser: USer) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            await ref.doc(updateUser);

            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );

  const updateOne = useCallback(
    (target: keyof User, value: string) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            if (!user) {
              return resolve({ message: "login?" });
            }
            await ref.doc(user.uid).update({ [target]: value });
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  return (
    <AUTH.Context.Provider value={{ signin, signout, updateAll, updateOne }}>
      {children}
    </AUTH.Context.Provider>
  );
};

export default AuthProvider;
