import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
const api = axios.create({
  baseURL: "https://your-api-url.com",
  headers: { "Content-Type": "application/json" },
});

interface UseApiOptions<T> {
  endpoint: string;
  queryKey?: string[];
  config?: AxiosRequestConfig;
}

export function useApi<T extends { id?: number | string }>({
  endpoint,
  queryKey = [endpoint],
  config,
}: UseApiOptions<T>) {
  const queryClient = useQueryClient();

  const getAll = useQuery<T[]>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get(endpoint, config);
      return data;
    },
  });

  const getOne = async (key: string | number) => {
    const { data } = await api.get(`${endpoint}/${key}`, config);
    return data as T;
  };

  const create = useMutation({
    mutationFn: async (newData: Partial<T>) => {
      const { data } = await api.post(endpoint, newData, config);
      return data as T;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const edit = useMutation({
    mutationFn: async (updatedData: T) => {
      if (!updatedData.id) throw new Error("Missing ID for update");
      const { data } = await api.put(
        `${endpoint}/${updatedData.id}`,
        updatedData,
        config
      );
      return data as T;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await api.delete(`${endpoint}/${id}`, config);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    getAll,
    getOne,
    create,
    edit,
    remove,
  };
}
