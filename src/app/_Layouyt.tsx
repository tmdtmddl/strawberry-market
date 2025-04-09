"use client";

import { AUTH } from "@/contexts";
import { usePathname, useRouter } from "next/navigation";
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";
import { IoIosList } from "react-icons/io";
import {
  IoBasketOutline,
  IoCubeOutline,
  IoGiftOutline,
  IoGitMergeOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { TbCherryFilled } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

interface MenuProps {
  name: string;
  href: string;
  Icon: IconType;
}

const Root_Layout = ({ children }: PropsWithChildren) => {
  const { user, signout } = AUTH.use();

  const menus = useMemo<MenuProps[]>(() => {
    const items: MenuProps[] = [];

    const all: MenuProps = {
      name: "전체상품",
      href: "/products",
      Icon: IoGiftOutline,
    };
    const search: MenuProps = { name: "검색", href: "", Icon: IoSearchOutline };
    const order: MenuProps = {
      name: "주문내역",
      href: "",
      Icon: IoIosList,
    };
    if (!user) {
      items.push(
        all,
        {
          name: "로그인",
          href: "/signin",
          Icon: IoGitMergeOutline,
        },
        {
          name: "홈",
          href: "/",
          Icon: IoGitMergeOutline,
        },
        {
          name: "회원가입",
          href: "/signup",
          Icon: IoGitMergeOutline,
        },
        search
      );
    } else {
      if (!user.sellerId) {
        items.push(
          all,
          { ...order, href: `/order?uid=${user.uid}` },
          {
            name: "나의상품",
            href: `/products?uid=${user.uid}`,
            Icon: IoCubeOutline,
          },
          {
            name: "장바구니",
            href: `/cart?uid=${user.uid}`,
            Icon: IoBasketOutline,
          },
          search
        );
      }
    }

    return items;
  }, [user]);
  const pathname = usePathname();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isKeywordShowing, setIsKeywordShowing] = useState(false);
  const keywordRef = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    () =>
      setTimeout(() => {
        keywordRef.current?.focus();
      }, 100),
    []
  );
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-15 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-225 flex">
          <button
            className=" h-15 text-pink-500  text-xl flex items-center px-2.5 gap-x-2.5
            "
            onClick={() => {
              if (pathname !== "/") {
                return router.push("/", { scroll: true });
              }
            }}
          >
            <TbCherryFilled className="text-2xl" />
            {!isKeywordShowing && "딸기마켓"}
          </button>
          {isKeywordShowing && (
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={isKeywordShowing ? "검색어 입력 .." : undefined}
              className={twMerge(
                isKeywordShowing
                  ? " focus:text-pink-500 outline-none px-2.5 flex-1  h-15"
                  : "hidden"
              )}
              onBlur={() => setIsKeywordShowing(false)}
              ref={keywordRef}
              //검색하고나서 실행되는 event
              onKeyDown={(e) => {
                const { key, nativeEvent } = e;
                if (!nativeEvent.isComposing && key === "Enter") {
                  console.log("검색 ㄱㄱ");
                  setKeyword("");
                  setIsKeywordShowing(false);
                }
              }}
            />
          )}
        </div>
      </header>
      <main className=" py-15 min-h-screen ">
        {children}

        {user && <button onClick={signout}>로그아웃</button>}
      </main>
      <nav className="fixed bottom-0 left-0 w-full h-15 border-t border-gray-200 bg-white">
        <ul className=" flex">
          {menus.map((menu) => {
            const selected = pathname === menu.href;
            return (
              <li key={menu.name} className="flex-1">
                <button
                  onClick={() => {
                    if (menu.href.length > 0) {
                      return router.push(menu.href, { scroll: true });
                    }

                    if (menu.name === "검색") {
                      setIsKeywordShowing(true);
                      focus();
                    }

                    console.log(menu.name);
                  }}
                  className={twMerge(
                    " w-full h-15 flex flex-col justify-center items-center text-xs",
                    selected ? "text-pink-500" : "text-gray-500"
                  )}
                >
                  <menu.Icon className="text-xl" />
                  {menu.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Root_Layout;
