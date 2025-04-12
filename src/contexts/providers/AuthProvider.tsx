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
              return resolve({
                success: false,
                message: "알 수 없는 이유로 데이터를 가져오는데 실패했습니다.",
              });
            }
            const snap = await ref.doc(user.uid).get();
            const data = snap.data() as User;
            if (!data) {
              return resolve({
                message:
                  "존재하지 않는 유저입니다. 다시 한 번 회원가입 해주세요.",
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
            await authService.signOut(); //! firebase user 로그아웃
            setUser(null); //! React 유저 로그아웃
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
            //! 인증 => 회원가입
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
            delete newUser.password;
            console.log(newUser);
            //{}는 새로운 객체를 만들 준비,storedUser는 newUser랑 똑같은 값을 가지지만, 별개의 객체가 됨(원래 객체를 그대로 참조하는 게 아니라, 값만 복사해서 새 객체를 만드는 것!)

            const storedUser: User = { ...newUser, uid: user.uid };
            console.log(storedUser);

            //@ts-ignore
            delete storedUser.password;
            console.log(storedUser);
            //storedUser를 .set()으로 저장 (새 문서 생성 또는 기존 문서 덮어쓰기)
            console.log(user.uid);
            await ref.doc(user.uid).set(storedUser);

            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    []
  );

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

            await ref.doc(user.uid).update({ [target]: value });
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  useEffect(() => {
    console.log({ user });
  }, [user]);

  useEffect(() => {
    const subscribeUser = authService.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        console.log(" not user");
      } else {
        const { uid } = fbUser;
        console.log(uid);
        const snap = await ref.doc(uid).get();
        const data = snap.data() as User;
        if (!data) {
          console.log(" no user");
        } else {
          setUser(data ?? null);
        }
      }
      setInitialized(true);
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

// "use client";

// import {
//   PropsWithChildren,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   useTransition,
// } from "react";
// import { AUTH } from "../react.context";
// import { authService, dbService, FBCollection } from "@/app/lib";
// import { GiStrawberry } from "react-icons/gi";

// const AuthProvider = ({ children }: PropsWithChildren) => {
//   const [initialized, setInitialized] = useState(false);
//   const [user, setUser] = useState(AUTH.initialState.user);
//   const [isPending, startTransition] = useTransition();

//   const ref = useMemo(() => dbService.collection(FBCollection.USERS), []);

//   const signin = useCallback(
//     (email: string, password: string) =>
//       new Promise<Result>((resolve) =>
//         startTransition(async () => {
//           try {
//             const { user } = await authService.signInWithEmailAndPassword(
//               email,
//               password
//             );
//             if (!user) {
//               return resolve({
//                 success: false,
//                 message: "알 수 없는 이유로 데이터를 가져오는데 실패했습니다.",
//               });
//             }
//             const snap = await ref.doc(user.uid).get();
//             const data = snap.data() as User;
//             if (!data) {
//               return resolve({
//                 message:
//                   "존재하지 않는 유저입니다. 다시 한 번 회원가입 해주세요.",
//               });
//             }

//             setUser(data); //! 데이터베이스에서 가져온 유저

//             resolve({ success: true });
//           } catch (error: any) {
//             resolve({ message: error.message });
//           }
//         })
//       ),
//     [ref]
//   );

//   const signout = useCallback(
//     () =>
//       new Promise<Result>((resolve) =>
//         startTransition(async () => {
//           try {
//             await authService.signOut(); //! firebase user 로그아웃
//             setUser(null); //! React 유저 로그아웃
//             return resolve({ success: true });
//           } catch (error: any) {
//             return resolve({ message: error.message });
//           }
//         })
//       ),
//     []
//   );

//   const signup = useCallback(
//     (newUser: User & { password: string }) =>
//       new Promise<Result>((resolve) =>
//         startTransition(async () => {
//           try {
//             //! 인증 => 회원가입
//             const { user } = await authService.createUserWithEmailAndPassword(
//               newUser.email,
//               newUser.password
//             );
//             if (!user) {
//               return resolve({ message: "회원가입에 실패했습니다." });
//             }

//             //! 회원가입 정보를 데이터베이스 저장
//             //@ts-ignore
//             delete newUser.password;
//             const storedUser: User = { ...newUser, uid: user.uid };

//             //@ts-ignore
//             delete storedUser.password;
//             await ref.doc(user.uid).set(storedUser);

//             return resolve({ success: true });
//           } catch (error: any) {
//             return resolve({ message: error.message });
//           }
//         })
//       ),
//     []
//   );

//   const updateAll = useCallback(
//     (updatedUser: User) =>
//       new Promise<Result>((resolve) =>
//         startTransition(async () => {
//           try {
//             //! 유저의 모든 내용을 업데이트 시킴 => set/update
//             await ref.doc(updatedUser.uid).set(updatedUser);
//             await ref.doc(updatedUser.uid).update(updatedUser);
//             return resolve({ success: true });
//           } catch (error: any) {
//             return resolve({ message: error.message });
//           }
//         })
//       ),
//     [ref]
//   );

//   const updateOne = useCallback(
//     (target: keyof User, value: any) =>
//       new Promise<Result>((resolve) =>
//         startTransition(async () => {
//           try {
//             if (!user) {
//               return resolve({
//                 message:
//                   "로그인 한 유저만 사용할 수 잇는 기능입니다. 로그인 하시겠습니까?",
//               });
//             }

//             await ref.doc(user.uid).update({ [target]: value });
//             return resolve({ success: true });
//           } catch (error: any) {
//             return resolve({ message: error.message });
//           }
//         })
//       ),
//     [ref]
//   );

//   useEffect(() => {
//     console.log({ user });
//   }, [user]);

//   useEffect(() => {
//     const subscribeUser = authService.onAuthStateChanged(async (fbUser) => {
//       if (!fbUser) {
//         console.log("not logged in");
//       } else {
//         const { uid } = fbUser;
//         const snap = await ref.doc(uid).get();
//         const data = snap.data() as User;
//         if (!data) {
//           console.log("no user data");
//         } else {
//           setUser(data ?? null);
//         }
//       }

//       setTimeout(() => {
//         setInitialized(true);
//       }, 1000);
//     });

//     subscribeUser;
//     return subscribeUser;
//   }, []);

//   return (
//     <AUTH.Context.Provider
//       value={{
//         initialized,
//         isPending,
//         signin,
//         signout,
//         signup,
//         updateAll,
//         updateOne,
//         user,
//       }}
//     >
//       {!initialized ? (
//         <div className="modal con justify-center items-center text-theme bg-white">
//           <GiStrawberry className="text-6xl" />
//           <h1 className="text-2xl font-black">딸기마켓</h1>
//         </div>
//       ) : (
//         children
//       )}
//     </AUTH.Context.Provider>
//   );
// };

// export default AuthProvider;
