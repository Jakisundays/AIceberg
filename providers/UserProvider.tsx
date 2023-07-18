"use client";

import { MyUserContextProvider } from "@/hooks/useUser";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default UserProvider;
