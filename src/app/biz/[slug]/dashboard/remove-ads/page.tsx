"use client"
import { PremiumWarning } from "@/app/biz/_components/premium-warning"
import { Loader } from "@/components/shared/loader";
import { useActivatePremiumFeatureMutation, useIsFeatureActiveQuery } from "@/redux/api";
import { FeatureType } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function KagozAds() {
    const { slug } = useParams() as { slug: string }
    /**
     * Activate Premium Feature Mutation
     */
    const [activateFeature, { isLoading: activateFeatureLoading }] = useActivatePremiumFeatureMutation()

    /**
       * Has feature active
       */

    const { data, isLoading } = useIsFeatureActiveQuery({ slug, type: FeatureType.REMOVE_ADS })

    if (isLoading) {
        return (
            <Loader />
        )
    }
    return (
        <div>
            <PremiumWarning btnAction={() => {
                activateFeature({ slug, type: FeatureType.REMOVE_ADS }).then(res => {
                    console.log(res);

                    if (res.data?.url) {
                        window.open(res.data.url)
                    }

                })
            }} isLoading={activateFeatureLoading} feature={data} />
            <div className="flex items-center justify-between py-6">
                <div>
                    <h1 className="font-bold text-black text-mdx">Remove Ads</h1>
                </div>
            </div>
            <hr className="border-[#ededed] mb-6" />
            <div className="mt-6 ">
                <div className="text-black font-semibold my-6 *:list-item">
                    <p>
                        Unlocking this feature will remove relate business from you business page .
                    </p>
                    <p>
                        So there will be no ads on your business page.
                    </p>
                </div>
                <div className="relative w-full h-[45vh] my-6 fill-neutral-200 blur-[3px]">
                    <Image src={'/images/sponsored/sponsored_result.png'} className="h-32 object-cover" alt="" fill />
                </div>

            </div>
        </div>
    );
}
