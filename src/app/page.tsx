import Link from "next/link";

const Home = () => {
  return (
    <div>
      Home
      <Link href="/signup">회원가입</Link>
      <Link href="/signin">로그인</Link>
    </div>
  );
};

export default Home;
