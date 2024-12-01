"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"

export const BusinessFacilities = () => {
    const form = useForm({
        defaultValues: {
            facilities: [] as any[]
        }
    })

    const toggleFacility = (facility: string) => {
        form.setValue('facilities', form.watch('facilities').includes(facility) ? form.watch('facilities').filter((f: string) => f !== facility) : [...form.watch('facilities'), facility])
    }

    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">Business Facilities</h2>
            <div>
                <div className="flex items-center space-x-2 cursor-pointer select-none" onClick={() => toggleFacility('walksInWelcome') }>
                    <Checkbox checked={form.watch('facilities').includes('walksInWelcome')} />
                    <span className="text-muted">
                        Walks In Welcome
                    </span>
                </div>
            </div>
        </div>
    )
}