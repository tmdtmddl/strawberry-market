"use client";

import { dbService } from "./lib";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <button
        onClick={async () => {
          const ref = dbService.collection("todo");
          try {
            await ref.doc("ad").set({ message: "err" });
            alert("추가");
          } catch (error: any) {
            alert(error.message);
          }
        }}
      >
        dummy
      </button>
    </div>
  );
};

export default Home;
