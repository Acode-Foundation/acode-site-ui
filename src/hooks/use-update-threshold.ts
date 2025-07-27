import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateThreshold = async (threshold: number): Promise<{ message: string }> => {
  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/threshold`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ threshold }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update threshold");
  }

  return response.json();
};

export const useUpdateThreshold = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateThreshold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
    },
  });
};