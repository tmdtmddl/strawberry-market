import axios from "axios"; //HTTP 요청 보낼 때 사용.
import { useCallback, useMemo, useState, useTransition } from "react";
import { Loading, SubmitButton, TextInput } from "../components/ui";
import { AiOutlineSearch } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

interface JusoComponentProps {
  onChangeAddress: (address: Juso) => void; //주소를 선택했을 때 실행할 함수.
  addresses: Juso[]; //현재 선택된 주소 리스트.
}

const JusoComponent = ({ addresses, onChangeAddress }: JusoComponentProps) => {
  const [keyword, setKeyword] = useState("");
  const [isShowing, setIsShowing] = useState(false);
  const [items, setItems] = useState<Juso[]>([]); //검색된 주소 리스트 저장.
  // 현재 선택된 주소 정보를 저장. 초기값은 가짜값 하나 넣어놓음.
  const [juso, setJuso] = useState<null | Juso>({
    id: "123123",
    roadAddr: " ",
    zipNo: "",
    rest: "",
  });
  const [isPending, startTransition] = useTransition();

  const message = useMemo(() => {
    if (keyword.length === 0) {
      return "검색어를 입력해주세요.";
    }
    return null;
  }, [keyword]);

  const onSubmit = useCallback(() => {
    if (message) {
      return alert(message);
    }
    startTransition(async () => {
      setIsShowing(false); // 리스트 감추고
      setJuso(null); // 선택 주소 초기화
      try {
        // 검색어를 가지고 서버에 요청 보내기 (POST 방식).
        const { data } = await axios.post(`api/v0/juso`, {
          keyword: keyword,
          currentPage: 1,
          countPerPage: 20,
        });
        //받은 데이터를 리스트에 넣고 보여주기 상태로 전환.
        setItems(data.map((item: any) => ({ ...item, id: item.bdMgtSn })));
        setIsShowing(true);
      } catch (error: any) {
        alert(error.message);
      }
    });
  }, [keyword, message]);
  return (
    <div className="relative flex flex-col gap-y-2.5">
      {isPending && <Loading divClassName="bg-white/80" />}
      <div>
        <div className="flex items-end gap-x-2.5 ">
          <TextInput
            divClassName="flex-1"
            label="기본배송지"
            type="text"
            name="address"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <SubmitButton
            type="button"
            onClick={onSubmit}
            //클릭하면 검색 함수 실행.
            className="px-2.5 size-12 flex justify-center"
          >
            <AiOutlineSearch className="text-2xl" />
          </SubmitButton>
        </div>
        {/* 메세지가있으면 메시지 보여줌. */}
        {message && <label className="text-red-500 text-sm">{message}</label>}
      </div>
      {isShowing && (
        <ul className="mt-2.5 flex flex-col gap-y-1.5">
          {/* 검색된 주소 리스트를 보여줌. */}
          {items.map((juso) => {
            // 이미 선택된 주소인지 체크.
            const select = addresses.find((address) => address.id === juso.id);
            return (
              <li key={juso.id}>
                {/* 버튼을 누르면 주소 선택 상태로 저장하고 리스트 닫음. */}
                <button
                  type="button"
                  className={twMerge(
                    " w-full text-left h-10 px-2.5 rounded bg-gray-50/80",
                    select && "text-pink-500"
                  )}
                  onClick={() => {
                    setIsShowing(false);
                    setJuso(juso);
                  }}
                >
                  {juso.roadAddr},{juso.zipNo}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {juso && (
        <div className="flex flex-col gap-y-2.5 ">
          <div className="flex gap-x-2.5 ">
            <button className="h-12 flex-1 text-left " type="button">
              {juso.roadAddr}
            </button>
            <SubmitButton
              type="button"
              onClick={onSubmit}
              className="px-2.5 h-12 flex justify-center items-center"
            >
              재검색
            </SubmitButton>
          </div>
          <div className="flex gap-x-2.5 items-end">
            <TextInput
              value={juso.rest || ""}
              onChange={(e) =>
                setJuso((prev) => prev && { ...prev, rest: e.target.value })
              }
              name="rest"
              placeholder="501호"
              label="상세주소"
            />
            {/* 주소 정보를 부모 컴포넌트로 전달하고 선택 초기화. */}
            <SubmitButton
              type="button"
              className="px-2.5 flex-1 text-shadow-md"
              onClick={() => {
                onChangeAddress(juso);
                setJuso(null);
              }}
            >
              기본 배송지 저장
            </SubmitButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default JusoComponent;
