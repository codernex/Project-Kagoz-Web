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
import { type CreateReviewInput, createReviewSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

interface ReviewModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ReviewModal: React.FC<ReviewModalProps> = ({ open, setOpen }) => {
  const form = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
  });

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
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[60%] text-black p-[3rem]">
        <DialogHeader>
          <DialogTitle className="text-mdx font-bold">
            Write A Review
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-x-2xl">
          <div className="col-span-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-sm"
              >
                <FormField
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          Rate the products
                        </FormLabel>
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
                                  <StarIcon className="text-yellow-500 fill-yellow-500" />
                                ) : (
                                  <StarIcon className="text-[#EDEDED] fill-[#EDEDED]" />
                                )}
                              </span>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                  control={form.control}
                  name="rating"
                />

                <div className="flex items-center gap-x-[2rem] w-full">
                  <FormField
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-normal">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-[#FAFAFA] placeholder:text-[#9EA5AC]"
                              placeholder="Enter your name"
                            />
                          </FormControl>
                          <FormMessage />
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
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your phone"
                              className="bg-[#FAFAFA] placeholder:text-[#9EA5AC]"
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                    control={form.control}
                    name="phone"
                  />
                </div>
                <FormField
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            className="bg-[#FAFAFA] placeholder:text-[#9EA5AC]"
                            placeholder="Describe your message in 250 characters"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                  control={form.control}
                  name="phone"
                />

                <div>
                  <Label className="font-normal">Upload image</Label>
                  <FileUploadDropdown />
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
          <div className="bg-[#FAFAFA] h-fit w-full p-smdlg rounded-smd col-span-2">
            <h2 className="text-[2.4rem] font-bold">How to write a Review</h2>
            <p className="text-muted text-sm leading-smlg">
              Oescrbe ycur ce using the VOduct free torm form of nswets to
              questions
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
