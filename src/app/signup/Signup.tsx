"use client";
import { Form, Loading, SubmitButton, TextInput } from "../components";
import {
  emailValidator,
  korValidator,
  mobileValidator,
  passwordValidator,
} from "@/utils";
import axios from "axios";
import {
  useState,
  useCallback,
  useTransition,
  ChangeEvent,
  useMemo,
} from "react";
import JusoComponent from "./JusoComponent";

const initialState: DBUser = {
  addresses: [],
  createdAt: new Date(),
  email: "test@test.com",
  mobile: "01012341234",
  name: "테스트유저",
  password: "123123",
  sellerId: null,
  uid: "",
};

const Signup = () => {
  const [props, setProps] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const [isSearching, setIsSearching] = useState(
    props.addresses.length === 0 ? true : false
  );

  const onChangeP = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProps((prev) => ({ ...prev, [name]: value }));
  }, []);

  const emailMessage = useMemo(
    () => emailValidator(props.email),
    [props.email]
  );

  const passwordMessage = useMemo(
    () => passwordValidator(props.password),
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
    if (passwordMessage) {
      return alert(passwordMessage);
    }
    if (nameMessage) {
      return alert(nameMessage);
    }
    if (mobileMessage) {
      return alert(mobileMessage);
    }
    if (props.addresses.length === 0) {
      return alert("기본 배송지를 추가해주세요.");
    }

    startTransition(async () => {
      try {
        const { data } = await axios.post("/api/v0/users", props);

        console.log(data as User);
      } catch (error: any) {
        const message = error.response.data; // response.message
        alert(error.message);
      }
    });
  }, [props]);

  return (
    <Form onSubmit={onSubmit} className="p-5 max-w-100 sm:max-w-125 mx-auto">
      {isPending && <Loading fixed divClassName="bg-white/80" />}
      <TextInput
        className=""
        label="이메일"
        value={props.email}
        onChange={onChangeP}
        name="email"
        message={emailMessage}
      />
      <TextInput
        message={passwordMessage}
        className=""
        label="비밀번호"
        value={props.password}
        onChange={onChangeP}
        name="password"
        type="password"
      />
      <TextInput
        className=""
        label="이름"
        value={props.name}
        onChange={onChangeP}
        name="name"
        message={nameMessage}
      />
      <TextInput
        className=""
        label="연락처"
        value={props.mobile}
        onChange={onChangeP}
        name="mobile"
        message={mobileMessage}
      />
      {isSearching && (
        <JusoComponent
          onChangeAddress={(newAddress) => {
            const found = props.addresses.find(
              (item) => item.id === newAddress.id
            );
            if (!found) {
              setProps((prev) => ({ ...prev, addresses: [newAddress] }));
              setIsSearching(false);
            }
          }}
          addresses={props.addresses}
        />
      )}
      {props.addresses.map((addr) => (
        <div
          key={addr.id}
          className="border border-gray-200 p-2.5 rounded flex"
        >
          <div className="flex-1">
            <p className="line-clamp-1">{addr.roadAddr}</p>
            <p>
              {addr.zipNo}, {addr.rest}
            </p>
          </div>
          <button
            className="cursor-pointer text-red-500"
            onClick={() => {
              // 만약 주소에 하나밖에 남지 않았다면 주소를 검색하도록 isSearching => true
              if (props.addresses.length === 1) {
                setIsSearching(true);
              }

              // 주소에서 삭제
              setProps((prev) => ({
                ...prev,
                addresses: prev.addresses.filter((item) => item.id !== addr.id),
              }));
            }}
          >
            삭제
          </button>
        </div>
      ))}
      <SubmitButton className="mt-2.5">회원가입</SubmitButton>
    </Form>
  );
};

export default Signup;
