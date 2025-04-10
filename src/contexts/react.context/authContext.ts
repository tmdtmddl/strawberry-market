"use client";

import { useContext, createContext } from "react";

export interface Props {
  user: null | User;
  initialized: boolean;
  isPending: boolean; // useTransition React v19

  signin: (email: string, password: string) => PromiseResult;
  signout: () => PromiseResult;
  signup: (newUser: User & { password: string }) => PromiseResult;
  updateOne: (target: keyof User, value: any) => PromiseResult;
  updateAll: (updatedUser: User) => PromiseResult;
}

export const initialState: Props = {
  user: null,
  initialized: false,
  isPending: false,
  signin: async () => ({}),
  signup: async () => ({}),
  signout: async () => ({}),
  updateOne: async () => ({}),
  updateAll: async () => ({}),
};

export const Context = createContext(initialState);
export const use = () => useContext(Context);
