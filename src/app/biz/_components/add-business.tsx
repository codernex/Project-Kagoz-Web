"use client";
import { TextInput } from "@/components/shared/text-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useGetBusinessByCurrentUserQuery, useRegisterBusinessMutation } from "@/redux/api/business";
import { useForm } from "react-hook-form";

export default function AddBusiness({
  onOpenChange,
}: {
  onOpenChange?: boolean;
}) {

  /**
   * State Management Hooks
   */
  const { open, setOpen } = useAddBusinessModal();

  /**
   * Api Mutation & Queries
   */
  const [registerBusiness] = useRegisterBusinessMutation();

  /**
   * Current Users Business
   */
  const { data } = useGetBusinessByCurrentUserQuery()

  /**
   * Form Initialization
   */
  const form = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
    },
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange ? setOpen : () => { }}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="!text-black text-mdx">
              Add new Business
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => {
                registerBusiness(d).then(res => {
                  if (res.data || data?.length) {
                    setOpen(false)
                    form.reset()
                  }
                })
              })}
              className="space-y-4"
            >
              <TextInput
                control={form.control}
                name="name"
                label="Business Name"
                required
                placeholder="Business Name"
              />
              <TextInput
                control={form.control}
                name="mobile"
                label="Business Mobile"
                required
                placeholder="Business Mobile"
              />
              <TextInput
                control={form.control}
                name="email"
                label="Business Email"
                required
                placeholder="Business Email"
              />
              <Button className="bg-black rounded-xs">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
