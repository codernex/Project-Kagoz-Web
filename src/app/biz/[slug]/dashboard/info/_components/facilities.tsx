"use client"

import { CustomButton } from "@/components/shared/custom-button"
import { Loader } from "@/components/shared/loader"
import SvgInline from "@/components/shared/svg-inline"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { appendApi, cn } from "@/lib/utils"
import { useAddFacilityMutation, useGetBusinessBySlugQuery, useGetFacilitiesQuery } from "@/redux/api"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"

export const BusinessFacilities = () => {
    const { slug } = useParams() as { slug: string }
    const form = useForm({
        defaultValues: {
            facilities: [] as any[]
        }
    })
    const { data: facilities } = useGetFacilitiesQuery()
    const { data, isLoading } = useGetBusinessBySlugQuery(slug)

    const toggleFacility = (facility: number) => {
        form.setValue('facilities', form.watch('facilities').includes(facility) ? form.watch('facilities').filter((f: number) => f !== facility) : [...form.watch('facilities'), facility])
    }

    const [addfacility] = useAddFacilityMutation()

    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="text-black shadow-md py-[3rem] px-[2.4rem] rounded-smd">
            <h2 className="font-bold text-mdx mb-[2.4rem]">Business Facilities</h2>
            <div className="grid grid-cols-8">
                {
                    facilities?.map(f => {
                        const isExist = data?.facilities.find(fa => fa.id === f.id)
                        return (
                            <div key={f.id} className={cn("flex items-center space-x-2 cursor-pointer select-none", !!isExist && 'cursor-not-allowed')} onClick={() => {
                                if (!!isExist) return;
                                toggleFacility(f.id)
                            }}>
                                <Checkbox disabled={!!isExist} checked={form.watch('facilities').includes(f.id) || !!isExist} />
                                <span className="text-muted">
                                    {f.name}
                                </span>
                                <SvgInline className="w-10 h-10 hover:stroke-primary transition-colors ease-linear" url={appendApi(f.iconUrl)} />
                            </div>
                        )
                    })
                }
            </div>
            <div className="mt-6 flex justify-end">
                {form.watch('facilities').length ? <CustomButton onClick={
                    form.handleSubmit(d => {
                        addfacility({ slug, ...d })
                        form.reset()
                    })
                } className="bg-black rounded-xs">Save</CustomButton> : null}
            </div>
        </div>
    )
}