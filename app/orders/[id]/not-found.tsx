import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto">
      <div className="card text-center">
        <h1 className="text-xl font-semibold mb-3">Order Not Found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link href="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    </div>
  );
}
