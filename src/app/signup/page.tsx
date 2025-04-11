"use client";

import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { Form, useTextInput } from "../components";
import {
  emailValidator,
  korValidator,
  mobileValidator,
  passwordValidator,
} from "@/utils";
import JusoComponent, { JusoRef } from "./JusoComponent";
import { AUTH } from "@/contexts";
import Loading from "../components/Loading";
import { useNavi } from "@/hooks";

// type Signup = User & {password:string}

interface Signiup extends User {
  password: string;
}

const Signup = () => {
  const [signupProps, setSignupProps] = useState<Signiup>({
    createdAt: new Date(),
    email: "test@test.com",
    name: "김딸기",
    password: "123123",
    sellerId: null,
    uid: "",
    jusoes: [],
    mobile: "01012341234",
  });

  const { email, name, password, jusoes, mobile } = signupProps;
  const [contirmPassword, setContirmPassword] = useState("123123");

  const jusoRef = useRef<JusoRef>(null);

  const Email = useTextInput();
  const Password = useTextInput();
  const ConfirmPassword = useTextInput();
  const Name = useTextInput();
  const Mobile = useTextInput();

  const nameMessage = useMemo(() => korValidator(name), [name]);
  const mobileMessage = useMemo(() => mobileValidator(mobile), [mobile]);
  const emailMessage = useMemo(() => emailValidator(email), [email]);
  const passwordMessage = useMemo(
    () => passwordValidator(password),
    [password]
  );
  const confirmPasswordMessage = useMemo(() => {
    if (passwordValidator(contirmPassword)) {
      return passwordValidator(contirmPassword);
    }
    if (password !== contirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
  }, [contirmPassword]);

  const onChangeS = useCallback(
    (value: string, event: ChangeEvent<HTMLInputElement>) => {
      setSignupProps((prev) => ({ ...prev, [event.target.name]: value }));
    },
    [signupProps]
  );
  const { navi } = useNavi();
  const { user, signup, isPending } = AUTH.use();
  const onSubmit = useCallback(async () => {
    if (nameMessage) {
      alert(nameMessage);
      return Name.focus();
    }
    if (mobileMessage) {
      alert(mobileMessage);
      return Mobile.focus();
    }
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }
    if (confirmPasswordMessage) {
      alert(confirmPasswordMessage);
      return ConfirmPassword.focus();
    }
    if (jusoes.length === 0) {
      alert("기본배송지를 입력해주세요.");
      jusoRef.current?.openModal();
      jusoRef.current?.focusKeyword();
      return;
    }
    const { success, message } = await signup(signupProps);
    if (!success || message) {
      return alert(message ?? "회원가입시 문제가 발생했습니다.");
    }
    alert("회원가입을 축하합니다.");
    navi("/");
  }, [
    nameMessage,
    emailMessage,
    mobileMessage,
    passwordMessage,
    confirmPasswordMessage,
    jusoes,
    signupProps,
    signup,
  ]);

  return (
    <div className="">
      {isPending && <Loading container="" warp="" />}
      <Form
        onSubmit={onSubmit}
        className="w-full p-5"
        Submit={<button className="primary flex-1">회원가입</button>}
      >
        <Name.TextInput
          onChangeText={onChangeS}
          label=" 이름"
          placeholder="예)박보검"
          name="name"
          value={name}
          message={nameMessage}
        />
        <Mobile.TextInput
          onChangeText={onChangeS}
          label=" 전화번호"
          placeholder="010"
          name="moMobile"
          value={mobile}
          message={mobileMessage}
        />
        <Email.TextInput
          value={email}
          onChangeText={onChangeS}
          label="이메일"
          placeholder="**@**.**"
          message={emailMessage}
        />
        <Password.TextInput
          value={password}
          onChangeText={onChangeS}
          label="비밀번호"
          placeholder="6~18자리"
          type="password"
          message={passwordMessage}
        />
        <ConfirmPassword.TextInput
          onChangeText={setContirmPassword}
          label="비밀번호 확인"
          placeholder="*****"
          type="password"
          value={contirmPassword}
          message={confirmPasswordMessage}
        />
        {/* 주소컴포넌트 자리 */}
        <JusoComponent
          ref={jusoRef}
          jusoes={jusoes}
          onChangeJ={(j) => setSignupProps((prev) => ({ ...prev, jusoes: j }))}
        />
      </Form>
    </div>
  );
};

export default Signup;
