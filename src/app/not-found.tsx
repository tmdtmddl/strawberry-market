import Link from "next/link";

const NotFound = () => {
  return (
    <div className="border flex-1 justify-center items-center gap-y-5">
      <h1>존재하지 않는 페이지 입니다.</h1>
      <Link href="/" className="primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
