"use client";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Form, Loading, SubmitButton, TextInput } from "../components/ui";
import {
  emailValidator,
  korValidator,
  mobileValidator,
  pwValidator,
} from "@/utils";
import axios from "axios";
import JusoComponent from "./JusoComponent";

const initalState: DBUser = {
  addresses: [
    {
      id: "123123",
      roadAddr: "대전광역시 중구 중앙로",
      rest: "501호",
      zipNo: "121",
    },
  ],
  createdAt: new Date(),
  sellerId: null,
  password: "123123",
  email: "test@test.com",
  mobile: "01012341234",
  name: "테스트유저",
  uid: "",
};

const Signup = () => {
  const [props, setProps] = useState(initalState);
  const [isPending, startTransition] = useTransition();
  const [address, setAddress] = useState(initalState.addresses[0]);

  const onChangeP = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProps((prev) => ({ ...prev, [name]: value }));
  }, []);

  const emailMessage = useMemo(
    () => emailValidator(props.email),
    [props.email]
  );
  const pwMessage = useMemo(
    () => pwValidator(props.password),
    [props.password]
  );
  const nameMessage = useMemo(() => korValidator(props.name), [props.name]);

  const mobileMessage = useMemo(
    () => mobileValidator(props.mobile),
    [props.mobile]
  );

  const onSubmit = useCallback(() => {
    if (emailMessage) {
      return alert(emailMessage);
    }
    if (pwMessage) {
      return alert(pwMessage);
    }
    if (nameMessage) {
      return alert(nameMessage);
    }
    if (mobileMessage) {
      return alert(mobileMessage);
    }
    if (props.addresses.length === 0) {
      return alert("배송지를 입력해주세요.");
    }
    startTransition(async () => {
      try {
        const { data } = await axios.post("/api/v0/users", props);
        console.log(data as User);
      } catch (error: any) {
        alert(error.response.data);
      }
    });
  }, [props]);

  return (
    <Form onSubmit={onSubmit} className="p-5 max-w-100 sm:max-w-125 mx-auto">
      {isPending && <Loading fixed divClassName="bg-white/80" />}
      <TextInput
        label="이메일"
        name="email"
        value={props.email}
        onChange={onChangeP}
        message={emailMessage}
      />
      <TextInput
        label="비밀번호"
        name="password"
        type="password"
        value={props.password}
        onChange={onChangeP}
        message={pwMessage}
      />
      <TextInput
        label="이름"
        name="name"
        type="text"
        value={props.name}
        onChange={onChangeP}
        message={nameMessage}
      />
      <TextInput
        label="연락처"
        name="mobile"
        type="text"
        value={props.mobile}
        onChange={onChangeP}
        message={mobileMessage}
      />
      {props.addresses.length > 0 ? (
        <>
          <JusoComponent
            onChangeAddress={(newAddress) =>
              setProps((prev) => ({ ...prev, addresses: [newAddress] }))
            }
            addresses={props.addresses}
          />
          <SubmitButton>회원가입</SubmitButton>
        </>
      ) : (
        <TextInput
          label="기본배송지"
          name="add"
          value={`${props.addresses[0].roadAddr},${props.addresses[0].rest}`}
        />
      )}
    </Form>
  );
};

export default Signup;
