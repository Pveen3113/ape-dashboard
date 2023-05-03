import { getMe } from "@/api/user";
import { getAuthToken } from "@/utils/cookies";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const token = getAuthToken();
  return useQuery(["user"], getMe, {
    enabled: !!token,
  });
};
