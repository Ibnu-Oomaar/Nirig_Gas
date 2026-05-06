import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useInventory = () => {
  const queryClient = useQueryClient();

  const stockMovementsQuery = useQuery({
    queryKey: ["stock-movements"],
    queryFn: async () => {
      const { data } = await api.get("/stock-movements");
      return data;
    },
  });

  const createStockMovement = useMutation({
    mutationFn: async (movementData: any) => {
      const { data } = await api.post("/stock-movements", movementData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock updated successfully");
    },
  });

  const priceHistoryQuery = useQuery({
    queryKey: ["price-history"],
    queryFn: async () => {
      const { data } = await api.get("/products/price-history"); // Adjust endpoint if needed
      return data;
    },
  });

  return {
    stockMovements: stockMovementsQuery.data || [],
    priceHistory: priceHistoryQuery.data || [],
    isLoading: stockMovementsQuery.isLoading || priceHistoryQuery.isLoading,
    createStockMovement,
  };
};
