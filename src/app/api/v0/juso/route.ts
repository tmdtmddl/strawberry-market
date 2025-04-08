import { reponse } from "@/lib";
import axios from "axios";

export async function POST(req: Request) {
  const { keyword, currentPage, countPerPage } = await req.json();
  if (!keyword) {
    return reponse.error("");
  }
  if (!currentPage || !countPerPage) {
    return reponse.error("파라미터값을 확인해주세요.");
  }
  try {
    const { data } = await axios.get(process.env.NEXT_PUBLIC_JUSO_URL!, {
      params: {
        keyword,
        countPerPage,
        currentPage,
        resultType: "json",
        confmKey: process.env.NEXT_PUBLIC_JUSO_API_KEY,
      },
    });
    console.log(data);
    if (data.results.common.errorCode !== "0") {
      return reponse.error(data.results.common.errorMessage);
    }
    console.log(data);
    return reponse.success(data.results.juso);
  } catch (error: any) {
    return reponse.error(error.message);
  }
}
