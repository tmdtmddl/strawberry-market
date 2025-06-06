"use client";

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { AUTH } from "../react.context";
import { authService, dbService, FBCollection } from "@/app/lib";
import { GiStrawberry } from "react-icons/gi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false); //Firebase 초기화가 완료되었는지 여부 (true면 렌더 시작).
  const [user, setUser] = useState(AUTH.initialState.user);
  const [isPending, startTransition] = useTransition();

  //Firestore의 users 컬렉션을 참조하는 객체./useMemo로 한 번만 만들고 재사용.
  const ref = useMemo(() => dbService.collection(FBCollection.USERS), []);
  //Firebase 인증 → 로그인 성공 → Firestore에서 추가 정보 가져옴.가져온 정보를 setUser로 상태에 저장.

  const { data, error } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async (): Promise<null | User> => {
      if (!user) {
        return null;
      }
      const snap = await ref.doc(user.uid).get();
      const data = snap.data() as User | null;
      return data;
    },
  });

  //! re-validate -> invalidation
  const queryClient = useQueryClient();
  const caching = useCallback(() => {
    //! user 다시받아오기
    const queryKey = ["user", user?.uid];
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, user]);

  useEffect(() => {
    if (error) {
      console.log(error);
    } else {
      if (data) {
        //console.log(data)
        setUser(data);
      }
    }
  }, [data, error]);

  const signin = useCallback(
    (email: string, password: string) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            // 로그인 시도
            const { user } = await authService.signInWithEmailAndPassword(
              email,
              password
            );
            if (!user) {
              return resolve({
                success: false,
                message: "알 수 없는 이유로 데이터를 가져오는데 실패했습니다.",
              });
            }
            // DB에서 유저 정보 가져오기
            const snap = await ref.doc(user.uid).get();
            const data = snap.data() as User;
            if (!data) {
              return resolve({
                message:
                  "존재하지 않는 유저입니다. 다시 한 번 회원가입 해주세요.",
              });
            }

            setUser(data); //! 데이터베이스에서 가져온 유저 / 유저 저장

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
            await authService.signOut(); //! firebase user 로그아웃
            setUser(null); //! React 유저 로그아웃/ 유저 정보 제거
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );
  //Firebase로 회원가입 → Firestore에 추가 정보 저장./storedUser는 비밀번호를 제거한 새 유저 객체
  const signup = useCallback(
    (newUser: User & { password: string }) =>
      //newUser는 사용자가 입력한 회원가입 정보 (ex. 이메일, 이름, 비번 등)
      new Promise<Result>((resolve) =>
        //비동기 작업을 하므로 Promise로 감쌈.완료되면 resolve()로 결과를 전달해줄 예정.
        startTransition(async () => {
          //무거운 작업이니까, React의 startTransition으로화면 렌더링을 막지 않고 조용히 처리함.
          try {
            //! 인증 => 회원가입
            //Firebase에 실제로 회원가입 요청을 보냄.성공하면 user 안에 uid 등 유저 정보가 담김.
            const { user } = await authService.createUserWithEmailAndPassword(
              newUser.email,
              newUser.password
            );
            console.log(user);
            if (!user) {
              return resolve({ message: "회원가입에 실패했습니다." });
            }

            //! 회원가입 정보를 데이터베이스 저장
            //@ts-ignore
            delete newUser.password; //보안상 이유로 비밀번호는 삭제 (Firestore에 저장 안 함!)
            console.log(newUser);
            //{}는 새로운 객체를 만들 준비,storedUser는 newUser랑 똑같은 값을 가지지만, 별개의 객체가 됨(원래 객체를 그대로 참조하는 게 아니라, 값만 복사해서 새 객체를 만드는 것!)

            const storedUser: User = { ...newUser, uid: user.uid };
            console.log(storedUser); //uid를 포함한 새 유저 객체 생성이걸 Firestore에 저장할 거야.

            //@ts-ignore
            delete storedUser.password;
            console.log(storedUser);
            //storedUser를 .set()으로 저장 (새 문서 생성 또는 기존 문서 덮어쓰기)
            console.log(user.uid);
            await ref.doc(user.uid).set(storedUser); //uid를 포함한 새 유저 객체 생성이걸 Firestore에 저장할 거야.

            return resolve({ success: true }); // 성공적으로 끝났으니 resolve()로 알림 완료.
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );
  //유저 정보를 통째로 수정함 (관리자용 등).
  const updateAll = useCallback(
    (updatedUser: User) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            //! 유저의 모든 내용을 업데이트 시킴 => set/update
            await ref.doc(updatedUser.uid).set(updatedUser);
            await ref.doc(updatedUser.uid).update(updatedUser);
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );
  //예: updateOne("name", "홍길동") → 이름만 바뀜.
  const updateOne = useCallback(
    (target: keyof User, value: any) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          // console.log(target, 133); target은 User타입의 키를 문자열로 전달함 예로"email", "name", "uid", "sellerId", "createdAt"(키 이름을 문자열로 출력)
          try {
            if (!user) {
              return resolve({
                message:
                  "로그인 한 유저만 사용할 수 잇는 기능입니다. 로그인 하시겠습니까?",
              });
            }
            //! firebase에 데이터 저장하는 로직
            await ref.doc(user.uid).update({ [target]: value });
            //? client의 user업데이트 // => firebase 실시간 리스너 or react-query or setUSer로 업데이트
            // setUser({ ...user, [target]: value }); //! 제일 간단한방법 그러나 실시간으로 X
            caching();

            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref, user, caching]
  );

  //! 실시간 리스너 안좋은점 실시간으로 계속 요청을 날림
  // useEffect(() => {
  //   if (user) {
  //     // console.log({ user });
  //     const subscribeUser = dbService
  //       .collection(FBCollection.USERS)
  //       .doc(user.uid)
  //       .onSnapshot((snap) => {
  //         const data = snap.data() as User | null;
  //         if (!data) {
  //           return;
  //         }
  //         setUser(data);
  //       });
  //     // subscribeUser;
  //     return subscribeUser;
  //   }
  // }, [user]);

  //useEffect: 초기 로그인 상태 확인/앱이 켜졌을 때 Firebase에 이미 로그인된 유저가 있는지 확인.
  //왜 useEffect 가 필요한 걸까?
  //로그인/로그아웃 상태는 앱이 처음 시작할 때, 또는 사용자가 로그인/로그아웃할 때 바뀜.
  //이 상태를 실시간으로 자동 감지하고, 앱에 반영하려면 이 리스너가 필요함.
  //useEffect 를 써서 이 리스너를 한 번만 등록하고, 컴포넌트가 사라질 때 정리해주는 거야
  useEffect(() => {
    const subscribeUser = authService.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        console.log("not logged in");
      } else {
        const { uid } = fbUser;
        const snap = await ref.doc(uid).get();
        console.log(snap);
        const data = snap.data() as User;
        if (!data) {
          console.log("no user data");
        } else {
          console.log(data);
          setUser(data ?? null);
        }
      }

      setTimeout(() => {
        setInitialized(true);
      }, 1000);
    });

    subscribeUser;
    return subscribeUser;
  }, []);
  return (
    <AUTH.Context.Provider
      value={{
        initialized,
        isPending,
        signin,
        signout,
        signup,
        updateAll,
        updateOne,
        user,
      }}
    >
      {!initialized ? (
        <div className="modal con justify-center items-center text-theme bg-white">
          <GiStrawberry className="text-6xl" />
          <h1 className="text-2xl font-black">딸기마켓</h1>
        </div>
      ) : (
        children
      )}
    </AUTH.Context.Provider>
  );
};

export default AuthProvider;
