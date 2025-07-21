import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

export function useFetch<T>(endpoint: string | null | undefined) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data.data ?? []);
    } catch (error) {
      console.error("Gagal fetch data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (!endpoint) return;
    fetchData();
  }, [fetchData, endpoint]);

  return { data, setData, loading, fetchData };
}
