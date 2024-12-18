"use client"
import { TK_SYMBOL } from "@/lib/utils"
import { InfoIcon } from "lucide-react"

type IPremiumProps = {
    feature: IPremiumFeature & {
        hasFeatureActive: boolean
    } | undefined
    btnAction?: () => void,
    isLoading?: boolean
}
export const PremiumWarning: React.FC<IPremiumProps> = ({
    feature,
    btnAction = () => { },
    isLoading = false
}) => {
    if (feature?.hasFeatureActive) {
        return null
    }
    return (
        <div className="">
            <div className="bg-primary text-white rounded-sm items-center justify-between px-8 py-6 flex flex-wrap">
                <div className=" flex items-center space-x-6">
                    <InfoIcon />
                    <h2 className=" font-semibold text-white">
                        Activate this features, to access contents of this page
                    </h2>
                    <p className="font-semibold">
                        {TK_SYMBOL}{feature?.price} for {feature?.duration} days
                    </p>
                </div>

                <button onClick={btnAction} className="bg-white text-black px-6 py-2 rounded-xs mt-4">
                    {isLoading ? <>Loading</> : ''}Upgrade Now
                </button>
            </div>
        </div>
    )
}