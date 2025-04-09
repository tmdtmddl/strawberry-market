"use client";
import { createContext, useContext } from "react";

export interface AuthContext {
  user: User | null;
  initialized: boolean;
  isPending: boolean;
  signin: (eamil: string, password: string) => Promise<PromiseResult>;
  signout: () => void;
  signup: (newUser: DBUser) => Promise<PromiseResult>;
}

export const initialState: AuthContext = {
  user: null,
  initialized: false,
  isPending: false,
  signin: async () => ({}),
  signout: () => ({}),
  signup: async () => ({}),
};

export const context = createContext(initialState);

export const use = () => useContext(context);
