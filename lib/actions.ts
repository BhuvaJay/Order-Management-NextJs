"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { createOrderSchema, updateOrderSchema, orderFiltersSchema } from "@/lib/validations";

export async function createOrder(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
  };

  const validatedData = createOrderSchema.parse(rawData);

  const order = await prisma.workOrder.create({
    data: {
      ...validatedData,
      createdById: session.user.id,
      status: "OPEN",
    },
    include: {
      createdBy: true,
      assignedTo: true,
    },
  });

  revalidatePath("/orders");
  redirect(`/orders/${order.id}`);
}

export async function updateOrder(orderId: string, formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if order exists and user has permission
  const existingOrder = await prisma.workOrder.findUnique({
    where: { id: orderId },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  // Authorization: Users can only edit their own orders, managers can edit all
  if (session.user.role === "USER" && existingOrder.createdById !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    assignedToId: formData.get("assignedToId"),
  };

  // Only managers can update status and assignedTo
  const updateData: any = {};
  if (rawData.title) updateData.title = rawData.title;
  if (rawData.description) updateData.description = rawData.description;
  if (rawData.priority) updateData.priority = rawData.priority;
  
  if (session.user.role === "MANAGER") {
    if (rawData.status) updateData.status = rawData.status;
    if (rawData.assignedToId) updateData.assignedToId = rawData.assignedToId;
  }

  const validatedData = updateOrderSchema.parse(updateData);

  const order = await prisma.workOrder.update({
    where: { id: orderId },
    data: validatedData,
    include: {
      createdBy: true,
      assignedTo: true,
    },
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  return order;
}

export async function getOrders(filters: {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const validatedFilters = orderFiltersSchema.parse(filters);
  const { search, status, priority, page, limit } = validatedFilters;

  // Build where clause based on user role
  const where: any = {};
  
  // Role-based access: Users see only their orders, managers see all
  if (session.user.role === "USER") {
    where.createdById = session.user.id;
  }

  // Add filters
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  const [orders, totalCount] = await Promise.all([
    prisma.workOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        createdBy: true,
        assignedTo: true,
      },
    }),
    prisma.workOrder.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    orders,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getOrderById(orderId: string) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.workOrder.findUnique({
    where: { id: orderId },
    include: {
      createdBy: true,
      assignedTo: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Authorization: Users can only view their own orders, managers can view all
  if (session.user.role === "USER" && order.createdById !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return order;
}

export async function getAllUsers() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Only managers can get all users (for assignment)
  if (session.user.role !== "MANAGER") {
    throw new Error("Unauthorized");
  }

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });
}
