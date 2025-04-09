const Cart = async (props: any) => {
  const { uid } = await props.params;
  return <div>Cart: {uid}</div>;
};

export default Cart;
