"use client";

import { useNavi } from "@/hooks";
import { Form, useTextInput } from "../components";
import { AUTH } from "@/contexts";
import { emailValidator, passwordValidator } from "@/utils";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

const Signin = () => {
  const { user, signin } = AUTH.use();

  const [loginProps, setLoginProps] = useState({
    email: "test@test.com",
    password: "123123",
  });
  const Email = useTextInput();
  const Password = useTextInput();
  const { navi } = useNavi();

  const onChangeL = useCallback(
    (value: string, event: ChangeEvent<HTMLInputElement>) => {
      setLoginProps((prev) => ({ ...prev, [event.target.name]: value }));
    },
    []
  );

  const emailMessage = useMemo(
    () => emailValidator(loginProps.email),
    [loginProps.email]
  );
  const passwordMessage = useMemo(
    () => passwordValidator(loginProps.password),
    [loginProps.password]
  );

  const onSubmit = useCallback(async () => {
    //! useEffect 모든 회원의 이메일 가져오기
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }
    console.log({ loginProps });

    const { success, message } = await signin(
      loginProps.email,
      loginProps.password
    );

    if (!success || message) {
      return alert(message ?? "무슨문제임???");
    }
    alert(`${loginProps.email}님 환영합니다.`);

    return navi("/");
  }, [emailMessage, passwordMessage, loginProps, Email, Password]);

  if (user) {
    return <h1>유저에게 제한된 페이지 입니다.</h1>;
  }

  return (
    <Form
      buttonClassName="flex-col "
      Submit={
        <>
          <button className="primary">로그인</button>
          <button
            type="button"
            className="bg-gray-100"
            onClick={() => navi("/signup")}
          >
            회원가입
          </button>
        </>
      }
      onSubmit={onSubmit}
      className="p-5"
    >
      <Email.TextInput
        value={loginProps.email}
        onChangeText={onChangeL}
        name="email"
        label="이메일"
        message={emailMessage}
        placeholder="eamil@email.com"
        autoCapitalize="none"
      />
      <Password.TextInput
        value={loginProps.password}
        onChangeText={onChangeL}
        name="password"
        label="비밀번호"
        message={passwordMessage}
        placeholder="* * * * * * * *"
        type="password"
      />
    </Form>
  );
};

export default Signin;
