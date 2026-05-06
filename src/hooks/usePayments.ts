import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const usePayments = () => {
  const queryClient = useQueryClient();

  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data } = await api.get("/payments");
      return data;
    },
  });

  const createPayment = useMutation({
    mutationFn: async (paymentData: any) => {
      const { data } = await api.post("/payments", paymentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Payment recorded");
    },
  });

  const updatePayment = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await api.put(`/payments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Payment updated");
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/payments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Payment deleted (voided)");
    },
  });

  return {
    payments: paymentsQuery.data || [],
    isLoading: paymentsQuery.isLoading,
    createPayment,
    updatePayment,
    deletePayment,
  };
};
