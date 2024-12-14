"use client"
import { CustomButton } from "@/components/shared/custom-button";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useGetBusinessByCurrentUserQuery } from "@/redux/api";

export default function BusinessDashboard() {
  const { setOpen } = useAddBusinessModal()
  const { data } = useGetBusinessByCurrentUserQuery()

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center text-black font-semibold flex-col gap-3">
        <p className="text-md">Look like you {"don't have a business"}, Try to create one</p>
        <CustomButton onClick={() => setOpen(true)} className="rounded-xs bg-black">
          Add new
        </CustomButton>
      </div>
    )
  }

  return (
    <div>
      <h1>Business Dashboard</h1>
    </div>
  );
}
