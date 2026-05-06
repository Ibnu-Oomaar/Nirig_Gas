import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useDashboard = () => {
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/stats");
      return data;
    },
  });

  const chartQuery = useQuery({
    queryKey: ["dashboard", "charts"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/charts");
      return data;
    },
  });

  return {
    stats: statsQuery.data,
    charts: chartQuery.data,
    isLoading: statsQuery.isLoading || chartQuery.isLoading,
  };
};
