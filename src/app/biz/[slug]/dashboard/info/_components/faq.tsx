"use client";
import FAQ from "@/app/(public)/(home)/section/faq";
import Faq from "@/components/shared/faq";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddFaqMutation, useGetFaqsQuery } from "@/redux/api";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

export const Faqs = () => {
  const { slug } = useParams() as { slug: string };
  const { data, isLoading } = useGetFaqsQuery(slug);
  const [addFaq] = useAddFaqMutation();
  const form = useForm({
    defaultValues: {
      faqs: [
        {
          question: "",
          answer: "",
        },
      ],
    },
  });
  return (
    <div className="p-6 space-y-8 text-black bg-white rounded-lg shadow">
      <h2 className="text-[2.4rem] font-semibold">{"FAQ's"}</h2>
      <Faq faqs={data} isLoading={isLoading} />

      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((d) => {
            addFaq({ slug, ...d });
            form.reset();
          })}
        >
          <div>
            <div className="flex flex-col gap-8">
              {form.watch("faqs").map((_, index) => {
                return (
                  <div key={index} className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.question`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <Input
                              placeholder="Test message"
                              className="placeholder:text-muted"
                              {...field}
                            />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.answer`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Answer</FormLabel>
                            <Textarea
                              placeholder="Faq"
                              className="placeholder:text-muted"
                              {...field}
                            />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <Button
              onClick={() =>
                form.setValue("faqs", [
                  ...form.watch("faqs"),
                  { question: "", answer: "" },
                ])
              }
              type="button"
              variant="outline"
              className="mt-4 border-primary text-primary hover:text-primary"
            >
              <PlusIcon />
              <span>Add FAQ</span>
            </Button>
          </div>

          <div className="flex justify-end">
            {form.getFieldState("faqs").isDirty && <Button>Save</Button>}
          </div>
        </form>
      </Form>
    </div>
  );
};
