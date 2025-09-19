import { getServerSession } from "@/lib/auth";
import { getOrderById } from "@/lib/actions";
import { OrderDetailPage } from "@/components/order-detail";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailRoute({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session?.user) {
    return (
      <div className="card">
        <h1 className="text-xl font-semibold">Not signed in</h1>
        <p className="mt-2">Please sign in to view this order.</p>
      </div>
    );
  }

  try {
    const order = await getOrderById(id);
    return (
      <OrderDetailPage 
        order={order} 
        userRole={session.user.role} 
      />
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Order not found") {
      notFound();
    }
    
    return (
      <div className="card">
        <h1 className="text-xl font-semibold mb-3">Error</h1>
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to load order"}
        </p>
      </div>
    );
  }
}
