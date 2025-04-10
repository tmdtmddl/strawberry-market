"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Form, useTextInput } from "../components";
import { emailValidator, passwordValidator } from "@/utils";
import { AUTH } from "@/contexts/react.context";

const Signin = () => {
  const [loginProps, setLoginProps] = useState({
    email: "test@test.com",
    password: "1231212",
  });
  const Email = useTextInput();
  const Password = useTextInput();
  const { user } = AUTH.use();
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

  const onSubmit = useCallback(() => {
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }
    console.log({ loginProps });
  }, [emailMessage, passwordMessage, loginProps, Email, Password]);

  useEffect(() => {
    console.log(loginProps);
  }, [loginProps]);

  if (!user) {
    console.log("no user");
  }

  return (
    <Form
      Submit={<button className="primary flex-1">로그인</button>}
      onSubmit={onSubmit}
      className="p-5"
    >
      <Email.TextInput
        value={loginProps.email}
        onChangeText={onChangeL}
        name="email"
        label="이메일"
        message={emailMessage}
        placeholder="email@email.com"
        autoCapitalize="none"
      />
      <Password.TextInput
        value={loginProps.password}
        onChangeText={onChangeL}
        name="password"
        label="비밀번호"
        message={passwordMessage}
        placeholder="******"
        type="password"
      />
    </Form>
  );
};

export default Signin;
