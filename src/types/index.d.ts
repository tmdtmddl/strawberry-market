interface User {
  email: string;
  name: string;
  addresses: Juso[];
  mobile: string;
  createdAt: Date;
  sellerId: string | null; // 판매자 사업자 등록번호
  uid: string;
}

interface DBUser extends User {
  password: string; // client - no password
}

interface Juso {
  id: string; // bdMgtSn
  roadAddr: string;
  zipNo: string;
  rest: string;
}

interface PromiseResult<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}
