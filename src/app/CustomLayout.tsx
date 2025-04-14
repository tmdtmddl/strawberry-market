"use client";
import { AUTH } from "@/contexts";
import { useTextInput } from "./components";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PropsWithChildren, useState, useMemo, useCallback } from "react";
import { IconType } from "react-icons";
import { GiStrawberry } from "react-icons/gi";
import {
  IoAccessibilityOutline,
  IoCardOutline,
  IoCarOutline,
  IoCartOutline,
  IoGiftOutline,
  IoHomeOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoSearchOutline,
  IoStatsChart,
} from "react-icons/io5";
import { twMerge } from "tailwind-merge";

const CustomLayout = ({ children }: PropsWithChildren) => {
  const { user } = AUTH.use();
  const pathname = usePathname();
  interface Menu {
    name: string;
    href: string; // 경로
    Icon: IconType; // <Iconname /> (XX)  //? ==>IconName (OO)
  }
  const menus = useMemo<Menu[]>(() => {
    console.log(pathname);
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
      if (pathname === `/${user.uid}`) {
        //user의 페이지 => 나의 상품관리하는 곳
        //나의 상품 ,주문내역,배송내역,매출기록,정산하기
        items.push(
          { ...home, name: "나의상품", href: `/${user.uid}` },
          {
            name: "주문내역",
            href: `/${user.uid}?target=payments`,
            Icon: IoReceiptOutline,
          },
          {
            name: "배송내역",
            href: `/${user.uid}?target=shipments`,
            Icon: IoCarOutline,
          },
          {
            name: "매출기록",
            href: `/${user.uid}?target=sales`,
            Icon: IoStatsChart,
          },
          {
            name: "정산하기",
            href: `/${user.uid}?target=money`,
            Icon: IoCardOutline,
          }
        );
      } else {
        items.push(
          { ...home, name: "전체상품" },
          {
            name: "나의상품",
            href: `/${user.uid}`,
            Icon: IoGiftOutline,
          },
          {
            name: "결제내역",
            href: `/${user.uid}/payments`,
            Icon: IoReceiptOutline,
          },
          {
            name: "장바구니",
            href: `/${user.uid}/cart`,
            Icon: IoCartOutline,
          },
          search
        );
      }
    }

    return items;
  }, [user, pathname]);

  const Keyword = useTextInput();
  const [keyword, setKeyword] = useState("");
  const target = useSearchParams().get("target"); //! target 그 차체 =?

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

      <main className="py-15 min-h-screen flex flex-col">{children}</main>

      <nav className="border-t border-gray-200 fixed bottom-0 left-0 w-full bg-white z-10">
        <ul className="flex-row gap-0">
          {menus.map((menu) => {
            //! user가 있으면 유저의 아이티 값과 pathname이 같은지 검사
            //! 위조건 만족시 => target가 없으면 나의 상품 선택
            //! target의 값을 비교

            //! 그렇지 않을 때 pathname === menu.href

            const selected = (): boolean => {
              if (!user) {
                //! user로그인 전에는 그냥 경로 같으면 됨
                return pathname === menu.href;
              }
              if (user) {
                //! 유저가 상품을 판매하기 위한 곳에 왔을 때
                if (`/${user.uid}` === pathname) {
                  // console.log(params)
                  if (!target) {
                    //! uid === 경로랑 같고 ,타겟이 없으면 전체상품페이지여서 바로 참
                    return menu.name === "나의상품";
                  }
                  //! 타겟이 있음 다른 메뉴를 구경중인 상태
                  const spilt = menu.href.split("=");
                  const menuTarget = spilt.length > 1 ? spilt[1] : "";
                  console.log(spilt, menuTarget);
                  return target === menuTarget;
                }
                //! 유저의  아이디 / 경로 장바구니, 주문내역 등 수현시 필요한 로직
              }

              return false;
            };

            // console.log(pathname);
            return (
              <li key={menu.href} className="flex-1">
                <Link
                  href={menu.href}
                  className={twMerge(
                    "flex-col h-15 flex-1 text-xs text-gray-500",
                    selected() && "text-theme"
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
