import { z } from "zod";

export const CreateVideoFeedbackSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  companyName: z.string().optional(),
  url: z
    .string()
    .regex(
      /^(https:\/\/youtu\.be\/[a-zA-Z0-9_-]+(\?si=[a-zA-Z0-9_-]+)?)|(https:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)$/,
      "Invalid YouTube embed URL"
    ),
  rating: z.number().min(1).max(5),
  logo: z.any().optional(), // File upload
});

export type CreateVideoFeedback = z.infer<typeof CreateVideoFeedbackSchema>;
