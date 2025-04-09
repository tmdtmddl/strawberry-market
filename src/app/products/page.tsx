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

  try {
    const { data } = await axios.post(url, { idToken });
    const { uid } = await props.params;
    const foundUser = data.users.find((user: any) => user.localId === uid);
    if (!foundUser) {
      return console.log("본인의 아이디가 아닙니다.");
    }
    console.log(
      "본인 페이지가 맞습니다. 데이터를 가져오면 됩니다. 데이터 가져오셈..."
    );
  } catch (error: any) {
    console.log(error);
  }
};

const MyProducts = async (props: any) => {
  await fetchUserInfo(props);
  return <div>MyProducts</div>;
};

export default MyProducts;
