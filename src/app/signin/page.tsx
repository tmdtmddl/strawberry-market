"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useTextInput } from "../components";

const Signin = () => {
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
  useEffect(() => {}, []);

  return (
    <form>
      <Email.TextInput
        value={loginProps.email}
        onChangeText={onChangeL}
        name="email"
      />
      <Password.TextInput
        value={loginProps.password}
        onChangeText={onChangeL}
        name="password"
      />
    </form>
  );
};

export default Signin;
