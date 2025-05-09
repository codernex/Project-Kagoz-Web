"use client";
import FileUploadDropdown from "@/components/shared/file-upload-dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateReviewMutation } from "@/redux/api";
import { type CreateReviewInput, createReviewSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

const messageObject: Record<number, { text: string; style: string }> = {
  1: {
    text: "Very Poor",
    style: "text-red-600"
  },
  2: {
    text: "Poor",
    style: "text-red-500"
  },
  3: {
    text: "Average",
    style: "text-gray-700"
  },
  4: {
    text: "Good",
    style: "text-green-600"
  },
  5: {
    text: "Very Good",
    style: "text-green-700"
  }
};

interface ReviewModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ReviewModal: React.FC<ReviewModalProps> = ({ open, setOpen }) => {
  const { slug } = useParams() as { slug: string }
  const [createReview] = useCreateReviewMutation()
  const form = useForm<CreateReviewInput>({
    defaultValues: {
      message: '',
      name: '',
      phone: '',
      rating: 0
    },
    resolver: zodResolver(createReviewSchema),
  });
  const [files, setFiles] = useState<File[]>([])

  /**
   * Star rating
   */
  const [selectedStars, setSelectedStars] = useState(0);
  const handleStarClick = useCallback((star: number) => {
    setSelectedStars(star);
  }, []);

  useEffect(() => {
    form.setValue("rating", selectedStars);
  }, [selectedStars, form]);

  /**
   * Handle Review Submit
   */

  const onSubmit: SubmitHandler<CreateReviewInput> = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
    if (files) {
      formData.append('image', files[0] as any)
    }

    createReview({ slug, data: formData })
    setOpen(false)
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-md:max-w-7xl lg:max-w-[60%] text-black p-[3rem] overflow-y-scroll max-h-[70vh] scrollbar-default">
        <DialogHeader>
          <DialogTitle className="text-mdx font-bold my-10">
            Write A Review
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-x-2xl">
          <div className="col-span-5 lg:col-span-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-sm"
              >
                <FormField
                  render={() => {
                    return (
                      <FormItem>
                        <div className="flex gap-8 items-center">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => {
                              const starValue = index + 1;
                              return (
                                <span
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleStarClick(starValue)}
                                >
                                  {starValue <= selectedStars ? (
                                    <StarIcon size={32} className="text-yellow-500 fill-yellow-500" />
                                  ) : (
                                    <StarIcon size={32} className="text-[#9e9e9e] fill-[#9e9e9e]" />
                                  )}
                                </span>
                              );
                            })}
                          </div>
                          {
                            messageObject[form.watch('rating')] &&
                            <p className={cn(
                              `${messageObject[form.watch('rating')]?.style} font-semibold text-md`
                            )}>
                              {messageObject[form.watch('rating')]?.text}
                            </p>}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                  control={form.control}
                  name="rating"
                />

                <div className="flex flex-col md:flex-row items-center gap-[2rem] w-full">
                  <FormField
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-normal">
                            Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-[#FAFAFA] placeholder:text-[#9EA5AC]"
                              placeholder="Enter your name"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      );
                    }}
                    control={form.control}
                    name="name"
                  />

                  <FormField
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-normal">
                            Phone *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your phone"
                              className="bg-[#FAFAFA] placeholder:text-[#9EA5AC]"
                              type="number"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      );
                    }}
                    control={form.control}
                    name="phone"
                  />
                </div>
                <FormField
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="bg-[#FAFAFA] placeholder:text-[#9EA5AC]"
                            placeholder="Describe your message in 250 characters"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    );
                  }}
                  control={form.control}
                  name="message"
                />

                <div>
                  <Label className="font-normal">Upload image</Label>
                  <FileUploadDropdown selectedFiles={files} setSelectedFiles={setFiles} />
                </div>

                <div className="flex justify-center space-x-smdlg lg:px-[8rem]">
                  <Button
                    onClick={() => setOpen(false)}
                    type="button"
                    variant={"outline"}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant={"default"} className="w-full">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="bg-[#FAFAFA] h-fit w-full p-smdlg rounded-smd col-span-5 lg:col-span-2">
            <h2 className="text-[2.4rem] font-bold">How to write a Review</h2>
            <p className="text-muted text-sm leading-smlg">
              Describe your thaugts
            </p>

            <ul className="mt-[2.5rem] lg:mt-[4rem] space-y-smd text-muted list-disc pl-[2rem]">
              <li>How long have you been this product?</li>
              <li>What criteria did you uses whenchoo-ching a product?</li>
              <li>
                What advantages and dsafvantages have you noticed in the
                proocess of using product?
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
