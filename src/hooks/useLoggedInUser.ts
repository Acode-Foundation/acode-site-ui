import { useQuery } from '@tanstack/react-query'
import { User } from "@/types";

export const fetchLoggedInUser = async (): Promise<User> => {
    const response = await fetch(`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        credentials: 'include'
    })

    if (!response.ok) {
        throw new Error("Could not get logged in.")
    }

    return await response.json()
}

export const useLoggedInUser = () => {
    return useQuery({
        queryKey: ['loggedInUser'],
        queryFn: async () => await fetchLoggedInUser(),

        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    })
}