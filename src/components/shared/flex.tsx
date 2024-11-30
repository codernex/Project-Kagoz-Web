import { cn } from "@/lib/utils"

export const Flex: React.FC<React.PropsWithChildren & {
    className?: string
}> = ({ children, className }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {children}
        </div>
    )
}