import Link from "next/link";

const Home = async () => {
  return (
    <div>
      <Link href="/signup">회원가입</Link>
      <Link href="/signin">로그인</Link>
    </div>
  );
};

export default Home;
