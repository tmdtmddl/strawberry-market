"use client";

import {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useTextInput } from "../components";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

export interface JusoRef {
  focusKeyword: () => void;
  openModal: () => void;
  focusNickname: () => void;
  focusDetail: () => void;
  closeModal: () => void;
}
interface Props {
  jusoes: Juso[];
  onChangeJ: (jusoes: Juso[]) => void;
  ref?: Ref<JusoRef>;
}
const cp = 20;
const JusoComponent = ({ jusoes, onChangeJ, ref }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [items, setItems] = useState<Juso[]>([]);
  const [keyword, setKeyword] = useState("");
  const [newJuso, setNewJuso] = useState<null | Juso>(null);
  const Nickname = useTextInput();
  const Deatil = useTextInput();

  const Keyword = useTextInput();
  const keywordMessage = useMemo(() => {
    //! 띄어쓰기 검사
    if (keyword.length === 0) {
      return "주소를 입력해주세요.";
    }

    const spilt = keyword.split(" ");
    if (spilt.length <= 1) {
      return "주소는 최소 두단어 이상입니다.";
    }
    //대전 중구
    if (keyword.split(" ")[1]?.length === 0) {
      return "주소는 최소 두단어 이상입니다.";
    }
    return null;
  }, [keyword]);

  const [isModalShowing, setIsModalShowing] = useState(false);

  //! modal or 평면에 그릴 것인지 선택
  const onSearch = useCallback(
    async (isFetchMore?: boolean) => {
      if (keywordMessage) {
        alert(keywordMessage);
        return Keyword.focus();
      }
      setIsModalShowing(true);

      let page = currentPage;

      if (isFetchMore) {
        if (totalPage - page === 0) {
          // 아래코드 실행ㄴㄴ
          return;
        }
        page += 1;
      }
      setNewJuso(null);
      //! zod =>env 검사해줘
      const url = `${process.env.NEXT_PUBLIC_JUSO_API_URL}&currentPage=${page}&countPerPage=${cp}&keyword=${keyword}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data, 63);
      //api에서 정해둔 에러 코드임
      if (data.results.common.errorCode !== "0") {
        return alert(data.results.common.errorMessage);
      }

      console.log(data.results);

      // console.log(data.results.juso);
      // console.log(data.results);

      const newItems = data.results.juso.map(
        (item: any) =>
          ({
            detail: "",
            id: item.id,
            nickname: "",
            roadAddr: item.roadAddr,
            zipNo: item.zipNo,
          } as Juso)
      );
      if (!isFetchMore) {
        setItems(newItems);
        const cnt = Number(data.results.common.totalCount);
        const totalPages = Math.ceil(cnt / cp);
        setTotalPage(totalPages);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setCurrentPage((prev) => prev + 1);
      }

      // console.log("검색 결과:", data.results.juso);
      //  setItems(data.results.juso as Juso[]);
    },
    [keyword, keywordMessage, Keyword, currentPage]
  );

  const JusoItem = useCallback(
    (juso: Juso) => {
      const { roadAddr, zipNo } = juso;
      return (
        <button
          type="button"
          onClick={() => setNewJuso(juso)}
          className=" justify-start text-left h-auto py-2.5 border border-gray-200"
        >
          {roadAddr}
          <span className="p-1 primary rounded text-xs"> {zipNo}</span>
        </button>
      );
    },
    [Nickname.focus]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  const onDone = useCallback(() => {
    if (newJuso) {
      if (newJuso.nickname.length === 0) {
        alert("주소지의 닉네임을 입력해주세요.");
        return Nickname.focus();
      }
      if (newJuso.detail.length === 0) {
        alert("상세주소를 입력해주세요.");
        return Deatil.focus();
      }
      //!주소 컴포넌트를 불러오는 곳에서 받아온 Juso 업데이트
      const found = jusoes.find((item) => item.id === newJuso.id);
      if (found) {
        alert("중복된 주소 입니다.");
        return;
      }
      onChangeJ([...jusoes, newJuso]);
      setNewJuso(null);
      setIsModalShowing(false);
      setKeyword("");
    }
  }, [newJuso]);

  const MyJusoItem = useCallback(
    (juso: Juso) => {
      const { detail, nickname, roadAddr, zipNo } = juso;
      const onDelete = () => {
        const copy = jusoes.filter((item) => item.id !== juso.id);
        onChangeJ(copy);
        alert("삭제되었습니다.");
        if (copy.length === 0) {
          setIsModalShowing(true);
          return Keyword.focus;
        }
      };
      return (
        <div className="border border-gray-200 p-2.5 rounded gap-y-1 relative">
          <button
            className="text-theme border h-auto p-1 absolute top-1 right-1 text-xs"
            type="button"
            onClick={() => {
              if (confirm("주소를 삭제하시겠습니까?")) {
                onDelete();
              } else {
                return alert("취소 했습니다.");
              }
            }}
          >
            삭제
          </button>
          <div className="flex-row">
            <p className="p-1 rounded bg-gray-100 text-xs">{nickname}</p>
          </div>
          <p>
            {roadAddr},{detail}
            <span className="p-1 rounded primary text-xs ml-2.5">{zipNo}</span>
          </p>
        </div>
      );
    },
    [jusoes, keyword, onChangeJ]
  );

  useImperativeHandle(ref, () => ({
    focusDetail: () => Deatil.focus(),
    focusKeyword: () => Keyword.focus(),
    focusNickname: () => Nickname.focus(),
    openModal: () => setIsModalShowing(true),
    closeModal: () => setIsModalShowing(false),
  }));
  return (
    <div>
      <div className="flex-row items-end">
        <Keyword.TextInput
          value={keyword}
          onChangeText={setKeyword}
          label="검색어"
          placeholder="대전 중구 중앙로 121"
          containerClassName="flex-1"
          onKeyDown={(e) => {
            const { key, nativeEvent } = e;
            if (key === "Enter" && !nativeEvent.isComposing) {
              onSearch();
            }
          }}
        />
        <button
          className="primary size-12 text-2xl"
          type="button"
          onClick={() => onSearch()}
        >
          <IoSearchOutline />
        </button>
      </div>

      {items.length > 0 && (
        <button
          type="button"
          className="text-theme"
          onClick={() => setIsModalShowing(true)}
        >
          {items.length}개의 검색된 주소가 있습니다.
        </button>
      )}

      {/* /추가된주소내역 */}
      <ul>
        {jusoes.map((juso) => (
          <li key={juso.id}>
            <MyJusoItem {...juso} />
          </li>
        ))}
      </ul>
      {/* modal */}

      <div
        className={twMerge(
          " fixed top-0 left-0 w-full z-50 h-screen  bg-black/3 justify-end items-center",
          isModalShowing ? " visible" : " invisible"
        )}
      >
        <div className="bg-white border border-gray-200 border-b-0 h-[90%] w-[calc(100%-40px)] rounded-t-2xl p-5 relative">
          <div className="flex-row items-end">
            <Keyword.TextInput
              value={keyword}
              onChangeText={setKeyword}
              label="검색어"
              placeholder="대전 중구 중앙로 121"
              containerClassName="flex-1"
              onKeyDown={(e) => {
                const { key, nativeEvent } = e;
                if (key === "Enter" && !nativeEvent.isComposing) {
                  onSearch();
                }
              }}
            />
            <button
              className="primary size-12 text-2xl"
              type="button"
              onClick={() => onSearch()}
            >
              <IoSearchOutline />
            </button>
          </div>

          <button
            type="button"
            className="border size-5 p-0 absolute -top-6 right-0 bg-white"
            onClick={() => setIsModalShowing(false)}
          >
            <IoCloseOutline />
          </button>

          {newJuso ? (
            <>
              <p className="p-2.5 rounded bg-gray-50">
                {newJuso.roadAddr},
                <span className="primary rounded p-0.5">{newJuso.zipNo}</span>
              </p>
              <Nickname.TextInput
                label="닉네임"
                placeholder="집/회사/직장 etc"
                value={newJuso.nickname}
                onChangeText={(value) =>
                  setNewJuso({ ...newJuso, nickname: value })
                }
              />

              <Deatil.TextInput
                label="상세주소"
                placeholder="501호"
                value={newJuso.detail}
                onChangeText={(value) =>
                  setNewJuso({ ...newJuso, detail: value })
                }
                onSubmitEditing={onDone}
              />
              <button type="button" className="primary" onClick={onDone}>
                주소 추가하기
              </button>
            </>
          ) : items.length === 0 ? (
            <button
              type="button"
              className="bg-gray-50 h-full text-gray-400"
              onClick={Keyword.focus}
            >
              검색된 주소가 없습니다.
            </button>
          ) : (
            <ul className="overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <JusoItem {...item} />
                </li>
              ))}
              {totalPage - currentPage > 0 && (
                <button
                  onClick={() => onSearch(true)}
                  type="button"
                  className="text-theme"
                >
                  더많은 주소보기({totalPage - currentPage})
                </button>
              )}
            </ul>
          )}
        </div>
        <span
          className=" absolute -z-10 size-full top-0 left-0 "
          onClick={() => setIsModalShowing(false)}
        />
      </div>
    </div>
  );
};

export default JusoComponent;

//! 1.주소 검색창 폼의 형태 input Dnter Tab =>onKeydown
//? -주소를 어디서 어떻게 가져올 것인가?
//? 1.공공데이터
//? 2.도로공사 주소 api사용  <---
//? 3.daum postcode api 사용
//? - 대전 중구 중앙로 121 중구까지만 검색하는 사람들을 위한

//! 주소값들을 선택할 수 있는 무언가 => 팝업 => 모달
//! 3. 상세 주소
//! 4.닉네임까지 완료 => 주소를 추가

//Todo 1. 검색어 검사 입력값이 2단어 이상 (띄워쓰기)
//Todo 2. 요청시 커런트 페이지 + 다음페이지가 있는지 등을 검사 -> 페이지네이션구현 또는 무한스크롤
//Todo 3. button type => button

//! 무한스크롤
//1. 현재페이지,최대페이지 == (모든 아이템의 갯수/ 현재헤이지에 보여질 아이템의 갯수)
// 현재 페이지.페이지별 갯수,최재페이지
//2.현재불러온 아이템이 잠겨있는 그릇 + 다시 쪼 물러올 아이템
//3. 1번그릇 + 2번그릇
//2번그릇은 더불러오면 20개의 아이템 담기고 1번그릇으로 20개를 추가해준 뒤 다시 비워줄 예정

//react qery => 간단하게 구현 가능
//! 1개의 큰 그릇이

//제한적인 테일윈드 애니메이션
//간단한 팁 -> transition className="transtion" 효과 지속시간 되게 짧음
//! duration-숫자 속도조절
