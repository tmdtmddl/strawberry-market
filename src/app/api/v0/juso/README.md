# 주소 검색을 위한 api 호출 및 주소 검색 / 추가시 로직

1. 회원가입시에는 기본 배송지가 비어있다.

   - 회원의 여러 배송지를 담을 그릇으로 addresses 등을 준비
   - juso null / Juso 객체 Ctrl + P => index.d.ts

2. 검색을 통해 주소를 찾고 선택했을 때 상세 주소를 입력할 수 있다.

   - keyword 검색 진행
   - juso들 또는 items 라는 주소들을 담을 그릇 준비
   - 주소호출이 끝나면 showing 등의 상태를 참으로 변경
   - 주소 하나를 클릭했을 때 showing => fal se로 변경
   - juso(null) => juso의 값으로 변경

3. 상세주소까지 입력했을 때 비로소 기본 배송지 하나를 추가할 수 있다.

   - juso가 선택되어서 null이 아닐때에만 상세주소를 입력
   - juso Component 자체를 안보이게 또는 삭제
     1. addresses 의 길이가 0이 아니게 되었을 때 삭제
     2. searching 불리언 상태로 조절
