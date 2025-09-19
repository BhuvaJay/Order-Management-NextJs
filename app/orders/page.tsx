import { getServerSession } from "@/lib/auth";
import Link from "next/link";
import { getOrders } from "@/lib/actions";
import { OrderFilters } from "@/components/order-filters";
import { OrderList } from "@/components/order-list";
import { Pagination } from "@/components/pagination";

interface OrdersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const session = await getServerSession();
  if (!session?.user) {
    return (
      <div className="card">
        <h1 className="text-xl font-semibold">Not signed in</h1>
        <p className="mt-2">Please <Link className="underline" href="/login">sign in</Link>.</p>
      </div>
    );
  }

  try {
    const { orders, pagination } = await getOrders({
      search: params.search,
      status: params.status,
      priority: params.priority,
      page: params.page ? parseInt(params.page) : 1,
    });
    console.log("orders", orders);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Work Orders</h1>
          <Link href="/orders/new" className="btn btn-primary">
            Create Order
          </Link>
        </div>

        <OrderFilters />

        <div className="card">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-zinc-500 mb-4">No orders found.</p>
              <Link href="/orders/new" className="btn btn-primary">
                Create your first order
              </Link>
            </div>
          ) : (
            <>
              <OrderList orders={orders} />
              <Pagination pagination={pagination} />
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="card">
        <h1 className="text-xl font-semibold mb-3">Error</h1>
        <p className="text-red-600">Failed to load orders. Please try again.</p>
      </div>
    );
  }
}
