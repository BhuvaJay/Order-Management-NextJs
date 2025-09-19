"use client";

import { useState } from "react";
import { createOrder } from "@/lib/actions";
import Link from "next/link";

export default function CreateOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError("");
    
    try {
      await createOrder(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders" className="btn">
          ← Back to Orders
        </Link>
        <h1 className="text-xl font-semibold">Create New Order</h1>
      </div>

      <div className="card">
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="label">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="input"
              placeholder="Enter order title"
              required
              maxLength={255}
            />
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="input min-h-[100px] resize-y"
              placeholder="Describe the work order details"
              required
              maxLength={1000}
            />
          </div>

          <div>
            <label htmlFor="priority" className="label">
              Priority
            </label>
            <select id="priority" name="priority" className="input" defaultValue="MED">
              <option value="LOW">Low</option>
              <option value="MED">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
            <Link href="/orders" className="btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
