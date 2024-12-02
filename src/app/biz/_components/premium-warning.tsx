"use client"
import { InfoIcon } from "lucide-react"

interface IPremiumProps {
    hasPremium: boolean
}
export const PremiumWarning: React.FC<IPremiumProps> = ({
    hasPremium
}) => {
    if (hasPremium) {
        return null
    }
    return (
        <div className="">
            <div className="bg-primary text-white rounded-sm items-center justify-between px-8 py-6 flex">
                <div className=" flex items-center space-x-6">
                    <InfoIcon />
                    <h2 className=" font-semibold text-white">
                        Activate this features, to access contents of this page
                    </h2>
                </div>
                <button className="bg-white text-black px-6 py-2 rounded-xs mt-4">
                    Upgrade Now
                </button>
            </div>
        </div>
    )
}