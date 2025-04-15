import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../components";
import MyProductForm from "./MyProductForm";
import { dbService, FBCollection } from "../lib";

interface Props {
  queryKey: any[];
  data: Product[];
}

const MyProudcts = ({ data, queryKey }: Props) => {
  const ADDPROUCT = useModal();
  // console.log(data)

  const queryClient = useQueryClient();
  //! CUD
  const mutation = useMutation({
    mutationFn: async ({
      action,
      product,
    }: {
      action: "CREATE" | "UPPDATE" | "DELETE";
      product: Product;
    }) => {
      try {
        // throw Error("Empty product");
        const ref = dbService.collection(FBCollection.PRODUCTS);
        switch (action) {
          case "CREATE":
            return await ref.add(product);
          case "UPPDATE":
            return await ref.doc(product.id).update(product);
          case "DELETE":
            return await ref.doc(product.id).delete();
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    //! side Effect
    //error handling
    onError: (err) => console.log(err.message),
    onSuccess: () => {
      console.log("success");
      //! caching 되어 있는 데이터를 다시 받아오게 만들기
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  return (
    <>
      {data.length === 0 ? (
        <div className=" flex-1 justify-center items-center">
          <button className="border" onClick={ADDPROUCT.open}>
            등록된 상품이 없습니다. 추가해주세요.
          </button>
          <ADDPROUCT.Modal state={ADDPROUCT.state}>
            <MyProductForm
              onSubmit={(item) =>
                mutation.mutate({ action: "CREATE", product: item })
              }
            />
            {/* <button
              className="primary"
              onClick={() =>
                mutation.mutate({ action: "CREATE", product: {} as Product })
              }
            >
              Test mutation
            </button> */}
          </ADDPROUCT.Modal>
        </div>
      ) : (
        <ul>
          {data.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MyProudcts;
