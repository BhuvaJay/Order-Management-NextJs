"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateOrder, getAllUsers } from "@/lib/actions";

interface Order {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface OrderDetailPageProps {
  order: Order;
  userRole: "USER" | "MANAGER";
}

export function OrderDetailPage({ order, userRole }: OrderDetailPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: order.title,
    description: order.description,
    priority: order.priority,
    status: order.status,
    assignedToId: order.assignedTo?.id || "",
  });

  useEffect(() => {
    if (userRole === "MANAGER") {
      getAllUsers()
        .then(setUsers)
        .catch(() => setUsers([]));
    }
  }, [userRole]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    console.log("handleFormSubmit");
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("priority", formData.priority);
      if (userRole === "MANAGER") {
        form.append("status", formData.status);
        form.append("assignedToId", formData.assignedToId);
      }

      await updateOrder(order.id, form);
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders" className="btn">
          ← Back to Orders
        </Link>
        <h1 className="text-xl font-semibold">Order Details</h1>
        <div className="flex items-center gap-2 ml-auto">
          <span className={`badge ${getStatusColor(order.status)}`}>
            {order.status.toLowerCase().replace("_", " ")}
          </span>
          <span className={`badge ${getPriorityColor(order.priority)}`}>
            {order.priority.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="label">
                Title
              </label>
              {isEditing ? (
                <input
                  id="title"
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  maxLength={255}
                />
              ) : (
                <p className="text-zinc-900 dark:text-zinc-100 font-medium">
                  {order.title}
                </p>
              )}
            </div>

            <div>
              <label className="label">Priority</label>
              {isEditing ? (
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MED">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              ) : (
                <span className={`badge ${getPriorityColor(order.priority)}`}>
                  {order.priority.toLowerCase()}
                </span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            {isEditing ? (
              <textarea
                id="description"
                className="input min-h-[120px] resize-y"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                maxLength={1000}
              />
            ) : (
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {order.description}
              </p>
            )}
          </div>

          {userRole === "MANAGER" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Status</label>
                {isEditing ? (
                  <select
                    className="input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                ) : (
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {order.status.toLowerCase().replace("_", " ")}
                  </span>
                )}
              </div>

              <div>
                <label className="label">Assigned To</label>
                {isEditing ? (
                  <select
                    className="input"
                    value={formData.assignedToId}
                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email} ({user.role.toLowerCase()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {order.assignedTo?.email || "Unassigned"}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="label">Created By</label>
              <p className="text-zinc-700 dark:text-zinc-300">
                {order.createdBy.email}
              </p>
            </div>
            <div>
              <label className="label">Created At</label>
              <p className="text-zinc-700 dark:text-zinc-300">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      title: order.title,
                      description: order.description,
                      priority: order.priority,
                      status: order.status,
                      assignedToId: order.assignedTo?.id || "",
                    });
                    setError("");
                  }}
                  className="btn"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Order
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
