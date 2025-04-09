//? SSR Server-side-rendering
//? server에서 데이터를 가지고 와서 시작할 수 있음

//! async로 페이지를 호출하면 서버에서 페이지를 만들어서 가져옴
//! client에서만 동작한는 훅,클릭이벤트 등 다 못씀

const OrderPage = async (props: any) => {
  const { uid } = await props.searchParams;
  return (
    <div>
      <h1>OrderPage:{uid}</h1>
    </div>
  );
};

export default OrderPage;
