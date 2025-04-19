"use client";
import React, { useCallback, useContext } from "react";
import { createContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, registerResponse } from "@/requests/auth";
import { IUser } from "@/types/user";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/navigation";
import { IAddress } from "@/types/address";
import { listAddresses } from "@/requests/address";

interface AuthenticatedContextProps {
  currentUser: IUser | null;
  loadingUser: boolean;
  logout: () => void;
  afterLogin: (data: { user: IUser; accessToken: string }) => void;
  addresses: IAddress[];
}

const AuthenticatedContext = createContext<AuthenticatedContextProps>({
  currentUser: null,
  loadingUser: false,
  logout: () => {},
  afterLogin: () => {},
  addresses: [],
});

export const AuthenticatedContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const cookies = parseCookies();
  const { data: currentUser, isPending: loadingUser } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => await getCurrentUser(),
    enabled: !!cookies.token,
  });

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => await listAddresses(),
    enabled: !!cookies.token,
  });

  const logout = useCallback(() => {
    destroyCookie({}, "token");
    router.push("/login");
  }, [router]);

  const afterLogin = useCallback(
    (data: registerResponse) => {
      setCookie(null, "token", data.accessToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      queryClient.invalidateQueries({
        queryKey: ["whoami"],
      });
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
      console.log(data.user.role);
      
      const nextRoute = data.user.role === "admin" ? "/admin/dashboard" : "/";
      console.log(nextRoute);
      
      router.push(nextRoute);
      router.refresh();
    },
    [queryClient, router]
  );

  return (
    <AuthenticatedContext.Provider
      value={{
        currentUser,
        loadingUser,
        logout,
        afterLogin,
        addresses: addresses || [],
      }}
    >
      {children}
    </AuthenticatedContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthenticatedContext);
};
