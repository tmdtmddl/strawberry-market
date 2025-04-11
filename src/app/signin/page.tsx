"use client";

import { Form, useTextInput } from "../components";
import { AUTH } from "@/contexts";
import { useNavi } from "@/hooks";
import { emailValidator, passwordValidator } from "@/utils";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

const Signin = () => {
  //! useEffect 등으로 모든 회원의 이메일을 가져오기

  const { user, signin } = AUTH.use();

  const [loginProps, setLoginProps] = useState({
    email: "test@test.com",
    password: "123123",
  });
  const Email = useTextInput();
  const Password = useTextInput();

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

  //! next/navigation (O) !== next/router (X)
  const { navi } = useNavi();
  const onSubmit = useCallback(async () => {
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }

    const { success, message } = await signin(
      loginProps.email,
      loginProps.password
    );
    if (!success || message) {
      return alert(message ?? "문제생김");
    }
    alert("환영합니다.");
    navi("/");
  }, [emailMessage, passwordMessage, loginProps, Email, Password, navi]);

  if (user) {
    return <h1>유저에게 제한된 페이지 입니다.</h1>;
  }

  return (
    <Form
      btnClassName="flex-col "
      Submit={
        <>
          <button className="primary">로그인</button>
          <button
            className="bg-gray-100"
            type="button"
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
