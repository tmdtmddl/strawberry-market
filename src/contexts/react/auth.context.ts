"use client";

import { createContext, useContext } from "react";

export interface Context {
  user: null | User;
  initialized: boolean;
  isPending: boolean;
  signout: () => Promise<PromiseResult>;
  signin: (email: string, password: string) => Promise<PromiseResult>;
  signup: (newUser: DBUser) => Promise<PromiseResult>;
  onUpdate: (target: keyof User, value: any) => Promise<PromiseResult>;
}

export const initialState: Context = {
  user: null,
  initialized: false,
  isPending: false,
  signin: async () => ({}),
  signup: async () => ({}),
  signout: async () => ({}),
  onUpdate: async () => ({}),
};

export const context = createContext(initialState);

export const use = () => useContext(context);
