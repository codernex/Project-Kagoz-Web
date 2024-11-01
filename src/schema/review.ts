import { z } from "zod";

export const createReviewSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  phone: z.string().min(1, "Please enter your phone number"),
  message: z.string().min(1, "Please enter a message"),
  rating: z.number().min(0).max(5),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
