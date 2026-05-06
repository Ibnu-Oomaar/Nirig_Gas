import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useSuppliers = () => {
  const queryClient = useQueryClient();

  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data } = await api.get("/suppliers");
      return data;
    },
  });

  const createSupplier = useMutation({
    mutationFn: async (supplierData: any) => {
      const { data } = await api.post("/suppliers", supplierData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier added successfully");
    },
  });

  const updateSupplier = useMutation({
    mutationFn: async ({ id, ...supplierData }: any) => {
      const { data } = await api.patch(`/suppliers/${id}`, supplierData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier updated successfully");
    },
  });

  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
  });

  return {
    suppliers: suppliersQuery.data || [],
    isLoading: suppliersQuery.isLoading,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
