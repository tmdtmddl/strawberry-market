interface User {
  email: string;
  name: string;
  uid: string;
  sellerId: string | null; // 판매자용 사업자등록번호
  createdAt: Date; // new Date()
  jusoes: Juso[];
  mobile: string;
}

interface Juso {
  nickname: string;
  roadAddr: string;
  id: string;
  detail: string;
  zipNo: string;
}

interface Result {
  success?: boolean;
  message?: string;
}
type PromiseResult = Promise<Result>;

interface Product {
  sellerId: string;
  name: string;
  price: number;
  created_at: string;
  imgUrls: string[];
  description: string[];
  id: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface PaymentHistory {
  items: CartItem[];

  paymentId: string;
  paymentMethod: "신용카드" | "계좌이체";
  paid_at: string;

  title: string;
}
