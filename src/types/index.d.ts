interface User {
  email: string;
  name: string;
  uid: string;
  sellerId: string | null; // 판매자용 사업자등록번호
  createdAt: Date; // new Date()
}

interface Result {
  success?: boolean;
  message?: string;
}
type PromiseResult = Promise<Result>;
