"use client";

import { authService } from "@/lib";
import { AUTH } from "../react";
import {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import axios from "axios";
import { isKorCharacter } from "@/utils";
import SplashScreen from "@/app/loading";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(AUTH.initialState.user);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const subscribeUser = authService.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        setUser(null);
      } else {
        const idToken = await fbUser.getIdToken();
        const { data } = await axios.get("/api/v0/user", {
          params: {
            uid: fbUser.uid,
          },
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (data) {
          setUser(data);
        }
      }

      setTimeout(() => setInitialized(true), 1000);
    });

    subscribeUser;
    return subscribeUser;
  }, []);

  // client 유저를 로그아웃
  //! server에서 쿠키 내용을 삭제
  const signout = useCallback(
    (): Promise<PromiseResult> =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            await authService.signOut();
            await axios.post("/api/v0/user");
            return ok({ success: true });
          } catch (error: any) {
            return ok({ success: false, message: error.message });
          }
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
            // console.log(error)
            return ok({ success: false, message: error.response.data });
          }
        })
      ),
    []
  );

  const signup = useCallback(
    async (newUser: DBUser) =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            const { user } = await authService.createUserWithEmailAndPassword(
              newUser.email,
              newUser.password
            );
            if (!user) {
              return ok({
                success: false,
                message: "회원가입에 실패했습니다.",
              });
            }

            const body: User = {
              ...newUser,
              uid: user.uid,
              createdAt: new Date(),
            };
            //@ts-ignore
            delete body.password;
            const { data } = await axios.post("api/v0/users", body);
            console.log(data);
            setUser(body);
            return ok({ success: true });
          } catch (error: any) {
            if (!isKorCharacter(error.message)) {
              return ok({ success: false, message: error.message });
            }
            // console.log(error)
            return ok({ success: false, message: error.response.data });
          }
        })
      ),
    []
  );

  const onUpdate = useCallback(
    (target: keyof User, value: any) =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            const { data } = await axios.patch("/api/v0/user", {
              target,
              value,
              // uid: user?.uid,//! 1번 방법
            });
            setUser((prev) => prev && { ...prev, [target]: value });
            ok(data);
          } catch (error: any) {
            ok({ success: false, message: error.response.data });
          }
        })
      ),
    []
  );

  useEffect(() => {
    console.log({ user });
  }, [user]);

  const onTest = useCallback(async () => {
    const idToken = await authService.currentUser?.getIdToken();
    try {
      console.log(axios.defaults.baseURL);
      const { data } = await axios.get("api/v0/user", {
        params: {
          uid: authService.currentUser?.uid,
        },
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      console.log(data);
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  return (
    <AUTH.context.Provider
      value={{
        user,
        initialized,
        isPending,
        signin,
        signout,
        signup,
        onUpdate,
      }}
    >
      {initialized ? children : <SplashScreen />}
    </AUTH.context.Provider>
  );
};

export default AuthProvider;
