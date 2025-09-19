"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize state after hydration to avoid mismatch
  useEffect(() => {
    setIsHydrated(true);
    setSearch(searchParams.get("search") || "");
    setStatus(searchParams.get("status") || "");
    setPriority(searchParams.get("priority") || "");
  }, [searchParams]);

  // Debounced search effect (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    const timeoutId = setTimeout(() => {
      updateFilters();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, isHydrated]);

  // Immediate filter for status and priority (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    updateFilters();
  }, [status, priority, isHydrated]);

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    params.set("page", "1"); // Reset to first page when filtering

    router.push(`/orders?${params.toString()}`);
  }, [search, status, priority, router]);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    router.push("/orders");
  };

  return (
    <div className="card">
      {!isHydrated ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Search</label>
            <div className="input h-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
          </div>
          <div>
            <label className="label">Status</label>
            <div className="input h-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
          </div>
          <div>
            <label className="label">Priority</label>
            <div className="input h-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
          </div>
          <div className="flex items-end gap-2">
            <div className="btn h-10 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
            <div className="btn h-10 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Search</label>
            <input
              type="text"
              className="input"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="label">Priority</label>
            <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MED">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

        <div className="flex items-end gap-2">
          <button onClick={clearFilters} className="btn">
            Clear
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
