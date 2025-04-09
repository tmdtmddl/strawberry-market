"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Form, Loading, SubmitButton, TextInput } from "../components/ui";
import { emailValidator, pwValidator } from "@/utils";
import { AUTH } from "@/contexts";
import { useRouter } from "next/navigation";
import { PiWifiMedium } from "react-icons/pi";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailMessage = useMemo(() => emailValidator(email), [email]);
  const passwordMessage = useMemo(() => pwValidator(password), [password]);

  const { isPending, signin } = AUTH.use();

  const router = useRouter();
  const onSubmit = useCallback(async () => {
    if (emailMessage) {
      return alert(emailMessage);
    }
    if (passwordMessage) {
      return alert(passwordMessage);
    }
    const { success, message } = await signin(email, password);
    if (!success) {
      return alert(message);
    }
    router.push("/", { scroll: true });
  }, [emailMessage, passwordMessage, email, password, signin, router]);
  return (
    <div className="flex flex-col gap-y-2.5 p-5 max-w-100 mx-auto">
      {isPending && <Loading fixed divClassName="bg-white/80" />}
      <Form onSubmit={onSubmit}>
        <TextInput
          value={email}
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          label="이메일"
          message={emailMessage}
        />
        <TextInput
          value={password}
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          label="비밀번호"
          message={passwordMessage}
        />
        <SubmitButton buttonClassName="mt-2">로그인</SubmitButton>
      </Form>
      <SubmitButton
        buttonClassName="w-full bg-gray-200 text-gray-900"
        onClick={() => router.push("/signup", { scroll: true })}
      >
        회원가입
      </SubmitButton>
    </div>
  );
};

export default SigninPage;
