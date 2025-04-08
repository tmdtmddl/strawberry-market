import axios from "axios";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Loading, SubmitButton, TextInput } from "../components/ui";
import { AiOutlineSearch } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

interface JusoComponentProps {
  onChangeAddress: (address: Juso) => void;
  addresses: Juso[];
}

const JusoComponent = ({ addresses, onChangeAddress }: JusoComponentProps) => {
  const [keyword, setKeyword] = useState("");
  const [isShowing, setIsShowing] = useState(false);
  const [items, setItems] = useState<Juso[]>([]);
  const [juso, setJuso] = useState<null | Juso>({
    id: "123123",
    roadAddr: "대전광역시 중구 중앙로 ",
    zipNo: "121",
    rest: "501호",
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
      setIsShowing(false);
      setJuso(null);
      try {
        const { data } = await axios.post(`api/v0/juso`, {
          keyword: keyword,
          currentPage: 1,
          countPerPage: 20,
        });
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
            className="px-2.5 size-12 flex justify-center"
          >
            <AiOutlineSearch className="text-2xl" />
          </SubmitButton>
        </div>
        {message && <label className="text-red-500 text-sm">{message}</label>}
      </div>
      {isShowing && (
        <ul className="mt-2.5 flex flex-col gap-y-1.5">
          {items.map((juso) => {
            const select = addresses.find((address) => address.id === juso.id);
            return (
              <li key={juso.id}>
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
              value={juso.rest}
              onChange={(e) =>
                setJuso((prev) => prev && { ...prev, rest: e.target.value })
              }
              name="rest"
              placeholder="501호"
              label="상세주소"
            />
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
