# 페이지 분담하기 : 페이지 장수,페이지 요구될 난이도

# 요구사항 명세서

- #RN001 아이디 (생략가능)
- 작업 페이지
- 작업자
- 진행상태 (계획중)
- 요구사항 상세내용 문자열 담은 배열

# interface type 정의하기

//게시글
interface PostForm {
tags:string[]
juso: string
imgs:string[]
id:string
content:string
uid?:string
createdAt: ; // 게시 시간
}
//알림
interface FollowNotice {
uid?:string //팔로우 당한 사람의 ID (나의 아이디)
id: string; // Firebase 문서 ID
senderId: string; // 팔로우한 사람의 ID
createdAt: ; // 알림 생성 시각
isRead: boolean; // 읽음 여부
}

//고객센터
interface QNA {
question:string
Answers:string[]
}

enum FBCollection {
POSTS = 'posts'
}

enum FBCollection_POST {
LIKES = 'likes'
shared = 'shared'
'bookmarked'
}

const db ={}

db.collection(FBCollection.POSTS).doc(postd).collection(FBCollection_POSTS.LIKES).doc(userId).delete()
db.collection(FBCollection.POSTS).doc(postd).collection(FBCollection_POSTS.LIKES).doc(userId).update

# firebase collection strategy

# ui 다듬기

interface Notification {
id :string // 해당 노티피케이션 아이디
followigId : string | null //내가 팔로우 한 사람의 아이디 //! 내가 팔로우 한 사람의 아이디 //! 내가 팔로우할 때
followerId : string // 팔로우 당할때는 ?
created_at: Date
isRead : boolean //읽음 여부 판단
}

//! 내가팔로우 할때

const followingNotigication1 :Notification1 ={
id:"ddd",
following:"follow 할 사람의 id",
follweId:null
creared_at:new Date()
isRead :false
}
const ref1 =dbService.collection(fbcollection.user).doc(uid).collection(fbc...natifi...)

//!다른사람한테 갈때
const followingNotigication2 :Notification1 ={
id:"ddddddd",
following:null,
follwerId:"dfdfdf"
creared_at:new Date()
isRead :false
}
