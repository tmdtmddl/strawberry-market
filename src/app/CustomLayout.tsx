"use client";
import { useTextInput } from "./components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useState, useMemo, useCallback } from "react";
import { IconType } from "react-icons";
import { GiStrawberry } from "react-icons/gi";
import {
  IoHomeOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { twMerge } from "tailwind-merge";

const user = null;
const CustomLayout = ({ children }: PropsWithChildren) => {
  interface Menu {
    name: string;
    href: string; // 경로
    Icon: IconType; // <Iconname /> (XX)  //? ==>IconName (OO)
  }
  const menus = useMemo<Menu[]>(() => {
    const items: Menu[] = [];
    const home: Menu = {
      name: "홈",
      href: "/",
      Icon: IoHomeOutline,
    };
    const search: Menu = {
      name: "검색",
      href: "",
      Icon: IoSearchOutline,
    };

    if (!user) {
      items.push(
        { name: "로그인", href: "/signin", Icon: IoPersonOutline },
        home,
        { name: "회원가입", href: "/signup", Icon: IoPersonAddOutline },
        search
      );
    } else {
    }

    return items;
  }, []);

  const pathname = usePathname();
  const Keyword = useTextInput();
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white z-10 border-b border-gray-200">
        <div className="flex-row gap-0">
          <Link
            href="/"
            className="text-xl gap-x-2.5 text-theme font-black h-15"
          >
            <GiStrawberry className="text-3xl" />
            {!Keyword.focused && " 딸기마켓"}
          </Link>
          <Keyword.TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="검색어를 입력해주세요."
            onKeyDown={(e) => {
              const { key, nativeEvent } = e;
              if (key === "Enter" && !nativeEvent.isComposing) {
                if (keyword.length === 0) {
                  alert("검색어를 입력해주세요.");
                  return focus();
                }
                console.log("검색 ㄱㄱ");
              }
            }}
            className={twMerge(
              "pl-0 border-none",
              Keyword.focused && "text-theme"
            )}
            containerClassName="flex-1"
            contentClassName="h-15"
          />
        </div>
      </header>

      <main className="py-15">{children}</main>

      <nav className="border-t border-gray-200 fixed bottom-0 left-0 w-full bg-white z-10">
        <ul className="flex-row gap-0">
          {menus.map((menu) => {
            const selected = pathname === menu.href;
            // console.log(pathname);
            return (
              <li key={menu.href} className="flex-1">
                <Link
                  href={menu.href}
                  className={twMerge(
                    "flex-col h-15 flex-1 text-xs text-gray-500",
                    selected && "text-theme"
                  )}
                  onClick={() => {
                    if (menu.name === "검색" || menu.href.length === 0) {
                      Keyword.focus();
                    }
                  }}
                >
                  <menu.Icon className="text-2xl" />
                  {menu.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default CustomLayout;
