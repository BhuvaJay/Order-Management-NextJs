import Link from "next/link";

interface Order {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: Date;
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

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
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
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {order.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                {order.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                <span>Created by {order.createdBy.email}</span>
                <span>•</span>
                <span>
                  Assigned to {order.assignedTo?.email || "Unassigned"}
                </span>
                <span>•</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span
                className={`badge ${getStatusColor(order.status)}`}
              >
                {order.status.toLowerCase().replace("_", " ")}
              </span>
              <span
                className={`badge ${getPriorityColor(order.priority)}`}
              >
                {order.priority.toLowerCase()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
