import React, { createContext, useCallback, useContext, useMemo } from "react"
import { useQuery, useQueryClient, QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query"
import { fetchLoggedInUser } from "@/hooks/useLoggedInUser"
import { User } from "@/types"

export type AuthContextState = {
    user: User,
    login: ({ formData }: { formData: FormData}) => Promise<Response>
    logout: () => Promise<Response>
    updateProfile: (
        formData: FormData,
        handleRedirect: (to: string) => void,
        emailOtp?: number
    ) => Promise<Response>,
    refetchUser: (options?: RefetchOptions) => Promise<QueryObserverResult<User, Error>>
    isLoading: boolean,
    isError: boolean
}

const AuthContext = createContext<AuthContextState>(null)

export function AuthProvider({ children }) {
    const queryClient = useQueryClient()

    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ["loggedInUser"],
        queryFn: fetchLoggedInUser,
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    const loginMutation = useMutation<Response, Error, { formData: FormData }>({
          mutationFn: async ({ formData }: { formData: FormData }) => {
            const res = await fetch(
              `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: formData,
              }
            );
            if (!res.ok) throw new Error("Login failed");
            // Invalidate / refetch current user to hydrate client
            await queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
            return res;
          },
    });
    
    const login = useCallback(
            async ({ formData }: { formData: FormData}): Promise<Response> => {
              return loginMutation.mutateAsync({ formData });
            },
            [loginMutation]
    );


    const logout = async (): Promise<Response> => {
        const response = await fetch(
			`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`,
			{
				method: "DELETE",
				credentials: "include",
			},
		);
        // no need to await; AS we don't need to block it. I want the response to return As soon as possible.
        queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });

        return response;
    }

    const updateProfile = async (
        formData: FormData,
        handleRedirect: (to: string) => void,
        emailOtp?: number
    ): Promise<Response> => {
        if(!(formData instanceof FormData) || typeof handleRedirect !== "function" || typeof emailOtp !== "number") throw Error(`[updateProfile] Params used must be: 'formData' as FormData, 'handleRedirect' as a typeof Function, (optionally) emailOTP? as a number`)

        if (emailOtp) formData.append("otp", emailOtp.toString());

        const response = await fetch(
            `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user`,
            {
                method: "PUT",
                body: formData,
                credentials: "include",
            },
        );

        return response;
    }

    const value = useMemo(() => ({
        user,
        isLoading,
        isError,
        login, 
        logout,
        updateProfile,
        refetchUser: refetch
    }), [user, isLoading, isError, login, logout, refetch])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}