import { PropsWithChildren } from "react";

const CustomLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <header>header</header>
      <main>{children}</main>
      <nav>bottom</nav>
    </>
  );
};

export default CustomLayout;
