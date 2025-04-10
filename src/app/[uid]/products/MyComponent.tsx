"use client";

import { Form, SubmitButton, TextInput, useModal } from "@/app/components";
import { AUTH } from "@/contexts";
import { isNum } from "@/utils";
import { useCallback, useMemo, useState } from "react";

const MyComponent = () => {
  const [id, setId] = useState("");
  const { user, onUpdate } = AUTH.use();

  const Seller = useModal();

  const message = useMemo(() => {
    if (id.length === 0) {
      return "사업자등록번호를 입력해주세요";
    }
    if (id.length !== 10) {
      return "사업자등록번호는 10자리입니다.";
    }
    if (!isNum(id)) {
      return "숫자만 입력해주세요";
    }
  }, [id]);

  const onSubmit = useCallback(async () => {
    if (message) {
      return alert(message);
    }
    const { success, message: msg } = await onUpdate("sellerId", id);

    return Seller.hide;
  }, [id, message, onUpdate]);
  if (!user) {
    return null;
  }
  return (
    <div>
      {!user.sellerId ? (
        <div className="flex flex-col gap-y-5 p-5">
          <h1>판매자 계정이 아닙니다. 사업자등록 번호를 등록해주세요.</h1>
          <SubmitButton className="px-2.5" onClick={Seller.open}>
            사업자 등록번호 입력
          </SubmitButton>
          <Seller.Modal className="p-5">
            <Form onSubmit={onSubmit}>
              <TextInput
                value={id}
                onChange={(e) => setId(e.target.value)}
                label="사업자등록번호"
                name="selleId"
                placeholder="0000-000-000"
                message={message}
              />
              <SubmitButton>사업자 등록번호 저장</SubmitButton>
            </Form>
          </Seller.Modal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyComponent;
