import { z } from "zod";

export const createOrderSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  priority: z.enum(["LOW", "MED", "HIGH"]).default("MED"),
});

export const updateOrderSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long").optional(),
  description: z.string().min(1, "Description is required").max(1000, "Description too long").optional(),
  priority: z.enum(["LOW", "MED", "HIGH"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  assignedToId: z.string().optional(),
});

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MED", "HIGH"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderFiltersInput = z.infer<typeof orderFiltersSchema>;
