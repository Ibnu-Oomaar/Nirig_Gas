import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { UserWithCount } from "@/types";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<UserWithCount[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });

  const createUser = useMutation({
    mutationFn: async (userData: any) => {
      const { data } = await api.post("/users", userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create user");
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, ...userData }: any) => {
      const { data } = await api.patch(`/users/${id}`, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    createUser,
    updateUser,
    deleteUser,
  };
};
