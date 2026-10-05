import { useState, useEffect, useCallback } from "react";

/**
 * useAdminData — tiny loader for admin sections: wraps an async store
 * call with loading/error state and a reload handle.
 */
export default function useAdminData(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err?.message || "Could not load data.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
