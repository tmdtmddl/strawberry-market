import { useCallback, useMemo, useState } from "react";
import { Form, Loading, useTextInput } from "../components";
import { AUTH } from "@/contexts";
import { isNum } from "@/utils";

const SellerIdForm = () => {
  const [sellerId, setSellerId] = useState("");
  const SellerId = useTextInput();
  const message = useMemo(() => {
    if (sellerId.length === 0) {
      return "판매자의 사업자 등록 번호를 입력해주세요.";
    }
    if (!isNum(sellerId)) {
      return "숫자만 입력해주세요.";
    }
    if (sellerId.length !== 10) {
      return "사업자등록번호는 10자리 입니다.";
    }
  }, [sellerId]);

  const { updateOne, isPending } = AUTH.use();
  const onSubmit = useCallback(async () => {
    if (message) {
      alert(message);
      return SellerId.focus();
    }
    const { success, message: responseMessage } = await updateOne(
      "sellerId",
      sellerId
    );
    if (!success) {
      return alert(
        responseMessage ?? "판매자 사업자 등록번호 등록이 실패했습니다."
      );
    }

    alert("판매자로 등록 되었습니다.");
  }, [sellerId, updateOne, message, SellerId]);
  return (
    <Form
      onSubmit={onSubmit}
      Submit={<button className="primary flex-1">판매자로 등록하기</button>}
      className="p-5"
    >
      {isPending && <Loading message="판매자로 등록중입니다..." />}
      <SellerId.TextInput
        value={sellerId}
        onChangeText={setSellerId}
        label="판매자 등록 번호"
        placeholder="000-00000-00"
        message={message}
      />
    </Form>
  );
};

export default SellerIdForm;
