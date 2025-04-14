"use client";

import { AUTH } from "@/contexts";
import SellerIdForm from "./SellerIdForm";

const MyPage = () => {
  const { user } = AUTH.use();

  if (!user?.sellerId) {
    return <SellerIdForm />;
  }

  //! user.sellerID가 있어야 상품 보여줄 거임
  return <div>MyPage</div>;
};

export default MyPage;
