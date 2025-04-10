import { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";

const AppProvider = ({ children }: PropsWithChildren) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
