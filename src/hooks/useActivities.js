import { useState, useEffect, useCallback } from "react";

export function useActivities(page = 1, limit = 10, cycle = "all") {
  const [activities, setActivities] = useState([]);
  const [availableCycles, setAvailableCycles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (cycle && cycle !== "all") params.append("cycle", cycle);
      
      const response = await fetch(`/api/activities?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
        setAvailableCycles(data.availableCycles || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Load activities error:", error);
    }
    setLoading(false);
  }, [page, limit, cycle]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return { activities, availableCycles, pagination, loading, reload: loadActivities };
}
