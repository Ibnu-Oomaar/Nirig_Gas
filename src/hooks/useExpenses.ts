import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data } = await api.get("/expenses");
      return data;
    },
  });

  const createExpense = useMutation({
    mutationFn: async (expenseData: any) => {
      const { data } = await api.post("/expenses", expenseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Expense recorded successfully");
    },
  });

  return {
    expenses: expensesQuery.data || [],
    isLoading: expensesQuery.isLoading,
    createExpense,
  };
};
