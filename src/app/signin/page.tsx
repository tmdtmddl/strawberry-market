"use client";

import { AUTH } from "@/contexts";
import { emailValidator, passwordValidator } from "@/utils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Form, Loading, SubmitButton, TextInput } from "../components";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailMessage = useMemo(() => emailValidator(email), [email]);
  const passwordMessage = useMemo(
    () => passwordValidator(password),
    [password]
  );

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
    // 원하는 곳으로 보내버리기
    router.push("/", { scroll: true });
  }, [emailMessage, passwordMessage, signin, email, password]);

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
          placeholder="email@email.com"
          message={emailMessage}
        />
        <TextInput
          message={passwordMessage}
          value={password}
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          label="비밀번호"
          placeholder="* * * * * * * *"
        />
        <SubmitButton className="mt-2.5">로그인</SubmitButton>
      </Form>
      <SubmitButton
        className="w-full bg-gray-50 text-gray-900"
        onClick={() => router.push("/signup", { scroll: true })}
      >
        회원가입
      </SubmitButton>
    </div>
  );
};

export default SigninPage;
