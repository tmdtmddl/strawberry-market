"use client";

import { useTextInput } from "../components";
import {
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
} from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

// const [ jusoes, setJusoes ] = useState<Juso[]>([])

export interface JusoRef {
  focusKeyword: () => void;
  openModal: () => void;
  focusNickname: () => void;
  focusDetail: () => void;
  closeModal: () => void;
}

//! React 19
interface Props {
  jusoes: Juso[];
  onChangeJ: (jusoes: Juso[]) => void;
  ref?: Ref<JusoRef>;
}

const cp = 20;
const JusoComponent = ({ jusoes, onChangeJ, ref }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [newJuso, setNewJuso] = useState<null | Juso>(null);

  const Nickname = useTextInput();
  const Detail = useTextInput();

  const [items, setItems] = useState<Juso[]>([]);
  const [keyword, setKeyword] = useState("");

  const Keyword = useTextInput();
  const keywordMessage = useMemo(() => {
    //! 띄어쓰기 '' ' '
    if (keyword.length === 0) {
      return "주소를 입력해주세요.";
    }

    const split = keyword.split(" ");
    if (split.length <= 1) {
      return "주소는 최소 2단어 이상입니다.";
    }

    //대전 중구
    if (keyword.split(" ")[1]?.length === 0) {
      return "주소는 최소 2단어 이상입니다.";
    }

    return null;
  }, [keyword]);

  const [isModalShowing, setIsModalShowing] = useState(false);
  //! modal => 평면에 그릴 것인지 선택
  const onSearch = useCallback(
    async (isFetchMore?: boolean) => {
      if (keywordMessage) {
        alert(keywordMessage);
        return Keyword.focus();
      }
      setIsModalShowing(true);
      //! zod => env 검사해줘

      let page = currentPage;

      if (isFetchMore) {
        if (totalPage - page === 0) {
          //아래 코드 실행 ㄴㄴ
          return;
        }
        page += 1;
      }

      setNewJuso(null);
      const url = `${process.env.NEXT_PUBLIC_JUSO_API_URL}&currentPage=${page}&countPerPage=${cp}&keyword=${keyword}`;

      const response = await fetch(url);
      const data = await response.json();

      console.log(data.results);
      // API 만든곳에서 정둔 에러코드임
      if (data.results.common.errorCode !== "0") {
        return alert(data.results.common.errorMessage);
      }

      const newItems = data.results.juso.map(
        (item: any) =>
          ({
            detail: "",
            id: item.bdMgtSn, //여기가 문제였음 item의 아이디로 쓸것 잘살펴보기
            nickname: "",
            roadAddr: item.roadAddr,
            zipNo: item.zipNo,
          } as Juso)
      );

      setItems((prev) => (isFetchMore ? [...prev, ...newItems] : newItems));
      if (!isFetchMore) {
        // items를 가져온 데이터로 바꾸기
        // setItems(
        //   newItems
        // );
        const cnt = Number(data.results.common.totalCount);
        const totalPages = Math.ceil(cnt / cp);
        setTotalPage(totalPages);
      } else {
        //다음 페이지 불러왔음 다음페이지 부를 준비하셈
        setCurrentPage((prev) => prev + 1);
        // setItems(prev => [...prev, ...newItems])
      }
    },
    [keyword, keywordMessage, Keyword, currentPage, totalPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  const JusoItem = useCallback(
    (juso: Juso) => {
      const { roadAddr, zipNo } = juso;
      return (
        <button
          type="button"
          onClick={() => {
            setNewJuso(juso);
            Nickname.focus();
          }}
          className="justify-start text-left h-auto py-2.5 block border border-gray-200"
        >
          {roadAddr}{" "}
          <span className="p-1 primary rounded text-xs">{zipNo}</span>
        </button>
      );
    },
    [Nickname.focus]
  );

  const onDone = useCallback(() => {
    //! 주소컴포넌트를 불러오는 곳에서 받아온 Juso를 업데이트

    if (!newJuso) {
      alert("주소를 선택해주세요.");
      return setIsModalShowing(true);
    }
    //! 닉네임 검사 , 상세주소
    if (newJuso.nickname.length === 0) {
      alert("주소지의 닉네임을 설정해주세요.");
      return Nickname.focus();
    }
    if (newJuso.detail.length === 0) {
      alert("상세주소를 입력해주세요.");
      return Detail.focus();
    }
    //? 중복 검사
    const found = jusoes.find((item) => item.id === newJuso.id);
    if (found) {
      alert("중복된 주소입니다."); //다시 검색해주세요.
      // 추가사항 옵션: newJuso => null, Keyword.focus()
      return;
    }
    onChangeJ([...jusoes, newJuso]);
    setNewJuso(null);
    setIsModalShowing(false);
    setKeyword("");
  }, [jusoes, newJuso, Detail, Nickname]);

  const MyJusoItem = useCallback(
    (juso: Juso) => {
      const { detail, nickname, roadAddr, zipNo } = juso;

      const onDelete = () => {
        const copy = jusoes.filter((item) => item.id !== juso.id);
        onChangeJ(copy);
        alert("삭제되었습니다.");
        if (copy.length === 0) {
          setIsModalShowing(true);
          Keyword.focus();
        }
      };

      return (
        <div className="border border-gray-200 p-2.5 rounded gap-y-1 relative">
          <button
            className="text-theme border h-auto p-1 absolute top-1 right-1 text-xs"
            type="button"
            onClick={onDelete}
          >
            삭제
          </button>
          <div className="flex-row">
            <p className="p-1 rounded bg-gray-100 text-xs">{nickname}</p>{" "}
          </div>
          <p>
            {roadAddr}, {detail}
            <span className="p-1 rounded primary text-xs ml-2.5">{zipNo}</span>
          </p>
        </div>
      );
    },
    [jusoes, onChangeJ, Keyword]
  );

  useImperativeHandle(
    ref,
    () => ({
      focusDetail: () => Detail.focus(),
      focusKeyword: () => Keyword.focus(),
      focusNickname: () => Nickname.focus(),
      openModal: () => setIsModalShowing(true),
      closeModal: () => setIsModalShowing(false),
    }),
    [Keyword, Nickname, Detail]
  );

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

      {/* 추가된 주소 내역 */}
      <ul>
        {jusoes.map((juso) => (
          <li key={juso.id}>
            <MyJusoItem {...juso} />
          </li>
        ))}
      </ul>

      {/* Modal */}

      <div
        className={twMerge(
          "fixed top-0 left-0 w-full h-screen z-50 bg-black/3 justify-end items-center",
          isModalShowing ? "visible" : "invisible"
        )}
      >
        <div
          className="bg-white border border-gray-200 border-b-0 h-[90%] w-[calc(100%-40px)] rounded-t-2xl p-5 relative transition duration-1000"
          style={{
            transform: `translateY(${isModalShowing ? 0 : "100%"})`,
          }}
        >
          <button
            type="button"
            className="border size-5 p-0 absolute -top-7 right-0"
            onClick={() => setIsModalShowing(false)}
          >
            <IoCloseOutline />
          </button>
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
          {newJuso ? (
            <>
              <p className="p-2.5 rounded bg-gray-50">
                {newJuso.roadAddr}{" "}
                <span className="text-xs primary p-1 rounded">
                  {newJuso.zipNo}
                </span>
              </p>
              <Nickname.TextInput
                label="닉네임"
                placeholder="집/회사/직장 etc"
                value={newJuso.nickname}
                onChangeText={(value) =>
                  setNewJuso({ ...newJuso, nickname: value })
                }
              />
              <Detail.TextInput
                label="상세주소"
                placeholder="501호"
                value={newJuso.detail}
                onChangeText={(value) =>
                  setNewJuso({ ...newJuso, detail: value })
                }
                onSubmitEditing={onDone}
              />

              <button className="primary" type="button" onClick={onDone}>
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
                  더 많은 주소 보기 ({totalPage - currentPage})
                </button>
              )}
            </ul>
          )}
        </div>
        <span
          className="absolute -z-10 size-full top-0 left-0"
          onClick={() => setIsModalShowing(false)}
        />
      </div>
    </div>
  );
};

export default JusoComponent;

//! 1. 주소 검색창 폼의 형태 input Enter Tab => onKeyDown
//? - 주소를 어디서 어떻게 가져올 것인가?
//? - 공공데이터
//? - daum postcode api 사용 <--
//? - 도로공사 주소 api 사용 구현
//? - 대전 중구 중앙로 121 중구까지만 검색을 하는 사람들 위한

//! 2. 주소값들을 선택할 수 잇는 무언가 => 팝업 => 모달
//! 3. 상세 주소
//! 4. 닉네임 까지 완료 => 주소를 추가

//Todo 1. 검색어 검사 입력값이 2단어 이상 (띄워쓰기)
// 2. 요청시 커런트 페이지 + 다음페이지가 있는지 등을 검사 -> 페이지네이션 구현 또는 무한스크롤
// 3. button type => button

//! 무한스크롤
// 1. 현재 페이지, 최대 페이지 == ( 모든 아이템의객수 / 현재페이지에 보여질 아이템의 객수 )
//! 현재 페이지, 페이지별갯수, 최대페이지

//2. 현재 불러온 아이템이 담겨있는 그릇 + 다시 또 불러올 아이템
// 3. 1번 그릇 + 2번 그릇
// 2번 그릇은 더 불러오면 20개의 아이템 담기고 1번그릇으로 20개를 추가해준 뒤 다시 비워줄 예정

// react query => 간단하게 구현
//! 1개의 큰 그릇이 여러개의 그릇을 담는 형태
// 아파트에 많은 집들이 있고 , 집에는 가족 구성원이 있다.
// 중첩 반복문

//! 제한적인 테일윈드 애니메이션 (진짜 애니메이션 ㄴㄴ) => 값의 변경 ㅇ
// 간단한 팁 -> transition className="transtion" //효과 지속시간 되게 짧다
//! duration-숫자 속도조절
// style={{ marginTop: state ? 0 : -50 }}
