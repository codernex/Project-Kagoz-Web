import { cn } from "@/lib/utils"
import { LockIcon } from "lucide-react"

export const LockFunctionalities: React.FC<{
    locked: boolean
}> = ({ locked }) => {
    return (
        <div className={cn(locked ? 'visible absolute h-full w-full z-50 top-0 left-0 rounded-sm bg-[#E3E3E399] flex items-center justify-center' : 'hidden')}>
            <LockIcon />
        </div>
    )
}