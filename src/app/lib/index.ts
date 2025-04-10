export * from "./firebase";
// export const response = {
//   //이 함수는 에러 메시지를 JSON으로 만들어서 응답하는 역할
//   //reponse.error(...) → 에러 응답을 만들어줌 (에러 메시지 + 상태코드)
//   error: (message: string, status: number = 500) =>
//     Response.json(message, { status }),
//   //reponse.success(...) → 성공 응답을 만들어줌 (보내줄 데이터 + 상태코드)
//   //status: number = 200 → 성공 응답은 기본적으로 200번 (OK)을 붙여줄게
//   success: <T>(data: T, status: number = 200) =>
//     Response.json(data, { status }),
// };
