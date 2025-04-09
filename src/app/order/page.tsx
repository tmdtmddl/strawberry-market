//?  SSR Server-Side-Rendering
//? server에서 데이터를 가지고 와서 시작할 수 있음

//! async 로 페이지를 호출하면 서버에서 페이지를 만들어서 가져옴
//! client에서만 동작하는 훅, 클릭 이벤트 등 다 못 씀
const OrderPage = async (props: any) => {
  const { uid } = await props.searchParams;
  return <div>OrderPage: {uid} </div>;
};

export default OrderPage;
