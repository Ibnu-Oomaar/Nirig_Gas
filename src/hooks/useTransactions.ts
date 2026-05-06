import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await api.get("/transactions");
      return data;
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (transactionData: any) => {
      const { data } = await api.post("/transactions", transactionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Transaction completed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Transaction failed");
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    createTransaction,
  };
};
