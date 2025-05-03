'use client'

import { useGetRelatedBusinessQuery, useIsFeatureActiveQuery } from "@/redux/api"
import { FeatureType } from "@/types"
import { useParams } from "next/navigation"
import RelatedItem from "./related-item"

export default function RelatedItemWrapper() {
    const { slug } = useParams() as { slug: string }
    const { data } = useIsFeatureActiveQuery({ type: FeatureType.REMOVE_ADS, slug })
    const { data: relatedBusiness } = useGetRelatedBusinessQuery(slug, {
        skip: data?.hasFeatureActive
    })

    if (!relatedBusiness?.length) {
        return null
    }
    return (
        <div className="space-y-[1.6rem] container mb-[6rem] mt-[4rem]">
            <h2 className="text-mdx font-bold text-black">Related Business</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3rem]">
                {
                    relatedBusiness.map((b) => {

                        return (
                            <RelatedItem business={b} key={b.id} />
                        )
                    })
                }
            </div>
        </div>
    )
}