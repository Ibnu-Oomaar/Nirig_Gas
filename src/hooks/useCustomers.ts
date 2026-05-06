import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await api.get("/customers");
      return data;
    },
  });

  const createCustomer = useMutation({
    mutationFn: async (customerData: any) => {
      const { data } = await api.post("/customers", customerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added successfully");
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...customerData }: any) => {
      const { data } = await api.patch(`/customers/${id}`, customerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully");
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },
  });

  return {
    customers: customersQuery.data || [],
    isLoading: customersQuery.isLoading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
