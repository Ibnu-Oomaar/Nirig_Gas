import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useAlerts = () => {
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data } = await api.get("/alerts");
      return data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/alerts/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  return {
    alerts: alertsQuery.data || [],
    unreadCount: (alertsQuery.data || []).filter((a: any) => !a.isRead).length,
    isLoading: alertsQuery.isLoading,
    markAsRead,
  };
};
