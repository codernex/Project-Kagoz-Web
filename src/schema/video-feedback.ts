import { z } from "zod";

export const CreateVideoFeedbackSchema = z.object({
  url: z
    .string()
    .regex(
      /^(https:\/\/youtu\.be\/[a-zA-Z0-9_-]+(\?si=[a-zA-Z0-9_-]+)?)|(https:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)$/,
      "Invalid YouTube embed URL"
    ),
});

export type CreateVideoFeedback = z.infer<typeof CreateVideoFeedbackSchema>;
