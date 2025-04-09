import axios from "axios";
import { cookies } from "next/headers";

const fetchUserInfo = async (props: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken");
  if (!token) {
    return console.log("no token");
  }
  const idToken = token.value;

  const url = process.env.NEXT_PUBLIC_FB_URL!;
  console.log(url, process.env.NEXT_PUBLIC_FB_URL, 12);
  try {
    const { data } = await axios.post(url, { idToken });
    console.log(data);
    const { uid } = await props.params;
    const foundUser = data.users.find((user: any) => user.localId === uid);
    if (!foundUser) {
      return console.log("본인의 아이디가 아닙니다.");
    }
  } catch (error: any) {
    console.log(error);
  }
};

const MyProducts = async (props: any) => {
  return <div>MyProducts</div>;
};

export default MyProducts;
