import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useShifts = () => {
  const queryClient = useQueryClient();

  const currentShiftQuery = useQuery({
    queryKey: ["current-shift"],
    queryFn: async () => {
      const { data } = await api.get("/shifts/current");
      return data;
    },
  });

  const shiftsQuery = useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      const { data } = await api.get("/shifts");
      return data;
    },
  });

  const startShift = useMutation({
    mutationFn: async (shiftData: any) => {
      const { data } = await api.post("/shifts", shiftData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-shift"] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift started successfully");
    },
  });

  const endShift = useMutation({
    mutationFn: async ({ id, ...shiftData }: any) => {
      const { data } = await api.patch(`/shifts/${id}/end`, shiftData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-shift"] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift ended successfully");
    },
  });

  return {
    currentShift: currentShiftQuery.data,
    shifts: shiftsQuery.data || [],
    isLoading: currentShiftQuery.isLoading || shiftsQuery.isLoading,
    startShift,
    endShift,
  };
};
