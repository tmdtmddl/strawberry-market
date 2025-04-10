"use client";
import { AUTH } from "@/contexts";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";
import {
  IoBasketOutline,
  IoCubeOutline,
  IoGiftOutline,
  IoHomeOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { TbCherryFilled } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

const Root_Layout = ({ children }: PropsWithChildren) => {
  const { user, signout } = AUTH.use();

  interface MenuProps {
    name: string;
    href: string;
    Icon: IconType;
  }
  const menus = useMemo<MenuProps[]>(() => {
    //만들어질 메뉴 리스트를 담을 배열
    const items: MenuProps[] = [];
    //전체상품, 주문내역, 검색 같은 메뉴들을 템플릿으로 만들어둔 것
    //필요할 때 items 배열에 추가만 하면 되게끔!
    const all: MenuProps = {
      name: "전체상품",
      href: "/products",
      Icon: IoGiftOutline,
    };
    const order: MenuProps = {
      name: "주문내역",
      href: "/orders",
      Icon: IoReceiptOutline,
    };
    const search: MenuProps = { name: "검색", href: "", Icon: IoSearchOutline };

    //유저가 로그인 안 했을 경우 아이템s에 push한 로직
    if (!user) {
      items.push(
        all,
        { name: "로그인", href: "/signin", Icon: IoPersonOutline },
        { name: "홈", href: "/", Icon: IoHomeOutline },
        { name: "회원가입", href: "/signup", Icon: IoPersonAddOutline },
        search
      );
    } else {
      //로그인은 했지만, 셀러는 아닌 경우
      if (!user.sellerId) {
        items.push(
          all,
          { ...order, href: `/${user.uid}/order` },
          {
            href: `/${user.uid}/products`,
            Icon: IoCubeOutline,
            name: "나의상품",
          },
          {
            href: `/${user.uid}/cart`,
            Icon: IoBasketOutline,
            name: "장바구니",
          },
          search
        );
      }
    }
    //최종 메뉴 반환(로그인 상태에 따라 조합된 메뉴 리스트를 menus에 담기)
    return items;
  }, [user]);

  const pathname = usePathname();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [isKeywordShowing, setIsKeywordShowing] = useState(false);
  const keywordRef = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    () => setTimeout(() => keywordRef.current?.focus(), 100),
    []
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-15 border-b border-gray-200 bg-white z-40">
        <div className="mx-auto max-w-225 flex">
          <button
            className="h-15 text-pink-500 text-xl flex items-center px-2.5 gap-x-2.5 cursor-pointer"
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={isKeywordShowing ? "검색어 입력..." : undefined}
              className={twMerge(
                isKeywordShowing
                  ? "outline-none px-2.5 flex-1 focus:text-pink-500"
                  : "hidden"
              )}
              onBlur={() => setIsKeywordShowing(false)}
              ref={keywordRef}
              onKeyDown={(e) => {
                const { key, nativeEvent } = e;
                console.log(key, keyword);
                if (!nativeEvent.isComposing && key === "Enter") {
                  console.log("검색 ㄱㄱ", keyword);
                  setKeyword("");
                  setIsKeywordShowing(false);
                }
              }}
            />
          )}
        </div>
      </header>

      <main className="py-15 min-h-screen">
        {children}
        {/* {user && <button onClick={signout}>로그아웃</button>} */}
      </main>

      <nav className="fixed bottom-0 left-0 w-full h-15 border-t border-gray-200 bg-white">
        <ul className="flex">
          {menus.map((menu) => {
            const selected = pathname === menu.href;

            return (
              <li key={menu.name} className="flex-1">
                <button
                  onClick={() => {
                    //menu.href 있음	해당 페이지로 이동 (router.push)
                    //menu.href 없음	검색창 열고, 포커스 줌 (setIsKeywordShowing, focus)
                    if (menu.href.length > 0) {
                      console.log(menu.href, 153);
                      return router.push(menu.href, { scroll: true });
                    }
                    console.log(menu.name);
                    setIsKeywordShowing(true);
                    focus();
                  }}
                  className={twMerge(
                    "w-full h-15 flex justify-center items-center flex-col text-xs cursor-pointer",
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
