import { normalizeLocation } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export const CommonSearchLink: React.FC<{ setOpen: React.Dispatch<React.SetStateAction<boolean>>, location: string, selectedTab: 'business' | 'categories', result: { slug: string, name: string, id: string } }> = ({
    setOpen,
    location,
    result,
    selectedTab
}) => {
    return (
        <Link
            onClick={() => setOpen(false)}
            href={
                selectedTab === "business"
                    ? `/business/${result.slug}`
                    : `/categories/${result.slug}-in-${normalizeLocation(location)}?location=${normalizeLocation(location)}`
            }
            key={result.id}
            className="flex cursor-pointer items-center justify-between rounded-[.6rem] border-b border-b-[#ededed] bg-gray-50 px-4 py-3 font-medium text-black last:border-b-0 hover:bg-gray-50"
        >
            {result.name}
            <ChevronRight />
        </Link>
    )
}