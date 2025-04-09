const Cart = async (props: any) => {
  const { uid } = await props.params;
  return (
    <div>
      <h1>Cart :{uid}</h1>
    </div>
  );
};

export default Cart;
