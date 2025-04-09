import { response } from "@/lib";
//response → 성공/실패 응답을 깔끔하게 정리하는 커스텀 함수
import axios from "axios";
// POST 함수는 클라이언트가 이 API에 POST 요청을 보냈을 때 실행되는 함수
export async function POST(req: Request) {
  // 요청 바디에서 데이터 꺼내기
  //프론트에서 보낸 요청(body)을 JSON으로 파싱해서 keyword, currentPage, countPerPage라는 파라미터 꺼냄
  const { keyword, currentPage, countPerPage } = await req.json();

  //유효성 검사
  if (!keyword) {
    return response.error("검색어를 입력해주세요.");
  }
  if (!currentPage || !countPerPage) {
    return response.error("파라미터값을 확인해주세요.");
  }
  // JUSO API 호출
  try {
    //주소 검색 API 서버(JUSO API)에 GET 요청을 보냄
    const { data } = await axios.get(process.env.NEXT_PUBLIC_JUSO_URL!, {
      //params는 요청 URL 뒤에 붙는 쿼리스트링이야 (?keyword=...&currentPage=... 이런 식)
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
      //API에서 주는 errorMessage를 그대로 응답으로 보내줌
      return response.error(data.results.common.errorMessage);
    }
    console.log(data);
    //주소 검색 결과가 정상이라면, 실제 주소 리스트만 응답으로 보냄(이때 data.results.juso가 주소 배열)
    return response.success(data.results.juso);
  } catch (error: any) {
    //axios 요청 자체가 실패했거나 예외가 나면 여기로 옴
    //에러 메시지를 담아 에러 응답 보냄
    return response.error(error.message);
  }
}

//예시 요약 흐름
//사용자가 "서울시 강남구" 입력 후 검색 버튼 클릭

// /api/route.ts로 POST 요청됨

//JUSO API에 GET 요청 전송

// 주소 리스트 받아서 클라이언트에 전송
