import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSwitchBusinessModal } from "@/hooks/switchBusinessModal";
import { ChevronRight, Plus } from "lucide-react";
import { useDynamicNavLink } from "./nav";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/button";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useGetBusinessByCurrentUserQuery } from "@/redux/api/business";

export default function SwitchBusiness() {
    /**
     * State Management Hooks
     */
    const { open, setOpen } = useSwitchBusinessModal()
    const { setOpen: setBusinessOpen } = useAddBusinessModal()

    const router = useRouter()

    /**
     * Api Query Hooks
     */
    const { data } = useGetBusinessByCurrentUserQuery()

    /**
     * Dynamic Nav Links
     */
    const { setSelectedSlug } = useDynamicNavLink()

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl text-black !rounded-xs">
                    <DialogHeader className="px-8">
                        <DialogTitle className="text-[2.4rem]">
                            Choose a Business
                        </DialogTitle>
                        <DialogDescription className="text-[1.3rem] text-muted">
                            Choose a business you want to manage right now, or if you {`don't`} have one, you can create one.
                        </DialogDescription>
                        <hr className="border-[#ededed]" />
                    </DialogHeader>

                    <div>
                        {
                            data?.map((b) => {
                                return (
                                    <div key={b.id} className="flex items-center justify-between px-8 py-2 cursor-pointer rounded-xs hover:bg-slate-100" onClick={() => {
                                        setSelectedSlug(b.slug)
                                        router.push(`/biz/${b.slug}/dashboard`)
                                        setOpen(false)
                                    }}>
                                        <h2 className="font-semibold text-md">{b.name}</h2>
                                        <ChevronRight />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="flex justify-end px-8">
                        <Button onClick={() => {
                            setBusinessOpen(true)
                            setOpen(false)
                        }} className="flex items-center justify-center py-4 max-w-[15rem] bg-black text-white rounded-xs">
                            <Plus />
                            <span>Create New</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}