"use client";
import React, { useContext } from "react";
import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/requests/auth";
import { IUser } from "@/types/user";
import { parseCookies } from "nookies";

interface AuthenticatedContextProps {
  currentUser: IUser | null;
  loadingUser: boolean;
}

const AuthenticatedContext = createContext<AuthenticatedContextProps>({
  currentUser: null,
  loadingUser: false,
});

export const AuthenticatedContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookies = parseCookies();
  const { data: currentUser, isPending: loadingUser } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => await getCurrentUser(),
    enabled: !!cookies.token,
  });

  return (
    <AuthenticatedContext.Provider value={{ currentUser, loadingUser }}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthenticatedContext);
};
