import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Form, useTextInput } from "../components";
import { AUTH } from "@/contexts";
import { isNum } from "@/utils";

interface Props {
  payload?: Product; //! payload가 있으면 수정: update 없으면 추가:create
  onSubmit: (product: Product) => void;
}

const MyProductForm = ({ onSubmit, payload }: Props) => {
  const { user } = AUTH.use();
  const initialState = useMemo<Product>(
    () =>
      payload ?? {
        created_at: new Date().toLocaleString(),
        description: [],
        id: "",
        imgUrls: [],
        name: "",
        price: 0,
        sellerId: user?.uid! ?? "",
      },
    [payload, user]
  );
  const [product, setProduct] = useState(initialState);

  const [desc, setDesc] = useState("");

  const Name = useTextInput();
  const Desc = useTextInput();
  const Price = useTextInput();

  const onChangeP = useCallback(
    (value: string, event: ChangeEvent<HTMLInputElement>) => {
      console.log(value, event.target.name);
      setProduct((prev) => ({
        ...prev,
        [event.target.name]:
          event.target.name === "price" ? Number(value) : value,
      }));
    },
    []
  );

  const nameMessage = useMemo(() => {
    if (product.name.length === 0) {
      return "상품명을 입력해주세요.";
    }
    return null;
  }, [product.name]);
  const descMessage = useMemo(() => {
    if (desc.length === 0) {
      return "상품상세설명을 입력해주세요.";
    }
    return null;
  }, [desc]);
  const descsMessage = useMemo(() => {
    if (product.description.length === 0) {
      return "상품상세설명을 1줄 이상 입력해주세요.";
    }
    return null;
  }, [product.description]);
  const priceMessage = useMemo(() => {
    console.log(typeof product.price, product.price);
    if (!isNum(product.price)) {
      return "숫자만 입력해주세요. ";
    }
    if (product.price === 0) {
      return "상품가격을 확인해주세요. ";
    }
    return null;
  }, [product.price]);

  return (
    <Form>
      <Name.TextInput
        value={product.name}
        onChangeText={onChangeP}
        name="name"
        label="상품명"
        placeholder="피카츄모자"
        message={nameMessage}
      />
      <Desc.TextInput
        value={desc}
        onChangeText={setDesc}
        name="description"
        label="상품 상세 설명"
        placeholder="피카츄 모자의 디테일 설명하기"
        message={descMessage}
      />
      <Price.TextInput
        value={product.price.toString()} //! number 타입을 문자열로 바꿔서 전달해주면 처음에시작하는 0을 없앨 수 있음.
        onChangeText={onChangeP}
        name="price"
        label="상품가격"
        placeholder="100000"
        type="number"
        message={priceMessage}
      />
    </Form>
  );
};

export default MyProductForm;
