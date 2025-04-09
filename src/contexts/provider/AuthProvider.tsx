"use client";

import { AUTH } from "../react";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { authService } from "@/lib";
import axios from "axios";
import { isKorCharacter } from "@/utils";
import SplashScreen from "@/app/loading";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [user, setUser] = useState(AUTH.initialState.user);

  useEffect(() => {
    const subscribeUser = authService.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        console.log("no user nono");
        setUser(null);
      } else {
        console.log(fbUser);

        const idToken = await fbUser.getIdToken();

        const { data } = await axios.get(`/api/v0/user`, {
          params: {
            uid: fbUser.uid,
          },
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log(data);
        if (data) {
          setUser(data);
        }

        console.log("fetch user");
      }
      setTimeout(() => setInitialized(true), 1000);
    });
    subscribeUser;
    return subscribeUser;
  }, []);

  //client 유저를 로그아웃
  // server에서 쿠키내용 삭제

  const signout = useCallback(
    () =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            await authService.signOut();
          } catch (error: any) {}
        })
      ),
    []
  );

  const signin = useCallback(
    async (email: string, password: string) =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            const { user } = await authService.signInWithEmailAndPassword(
              email,
              password
            );
            if (!user) {
              return ok({ success: false, message: "로그인에 실패했습니다." });
            }

            return ok({ success: true });
          } catch (error: any) {
            if (!isKorCharacter(error.message)) {
              return ok({ success: false, message: error.message });
            }
            console.log(error);
            return ok({ success: false, message: error.resoinse.data });
          }
        })
      ),
    []
  );

  const signup = useCallback(
    async (newUSer: DBUser) =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            const { user } = await authService.createUserWithEmailAndPassword(
              newUSer.email,
              newUSer.password
            );

            if (!user) {
              return ok({
                success: false,
                message: "회원가입에 실패했습니다.",
              });
            }
            const body: User = {
              ...newUSer,
              uid: user?.uid,
              createdAt: new Date(),
            };
            //@ts-ignore
            delete body.password;
            // const { data } = await axios.post("/api/v0/user", {
            //   body,
            // });
            // console.log(data);
            setUser(body);
            return ok({ success: true });
          } catch (error: any) {
            if (!isKorCharacter(error.message)) {
              return ok({ success: false, message: error.message });
            }
            console.log(error);
            return ok({ success: false, message: error.resoinse.data });
          }
        })
      ),
    []
  );

  useEffect(() => {
    console.log({ user });
  }, [user]);

  return (
    <AUTH.context.Provider
      value={{ initialized, signin, signout, user, isPending, signup }}
    >
      {initialized ? children : <SplashScreen />}
    </AUTH.context.Provider>
  );
};

export default AuthProvider;
