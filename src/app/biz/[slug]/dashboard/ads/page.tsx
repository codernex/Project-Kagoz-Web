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

  const { data, isLoading } = useIsFeatureActiveQuery({ slug, type: FeatureType.SPONSOR_BUSINESS })

  if (isLoading) {
    return (
      <Loader />
    )
  }
  return (
    <div>
      <PremiumWarning btnAction={() => {
        activateFeature({ slug, type: FeatureType.SPONSOR_BUSINESS }).then(res => {
          console.log(res);

          if (res.data?.url) {
            window.open(res.data.url)
          }

        })
      }} isLoading={activateFeatureLoading} feature={data} />
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">KAGOZ Ads</h1>
        </div>
      </div>
      <hr className="border-[#ededed] mb-6" />
      <div className="mt-6 ">
        <div className="text-black font-semibold my-6 *:list-item">
          <p>
            Unlocking this feature will allow you to comes on top of the all business page.
          </p>
          <p>
            And will enable to come feature business on the homepage. Next time your business could be one of these.
          </p>
        </div>
        <div className="relative w-full h-[45vh] my-6">
          <Image src={'/images/sponsored/sponsored_result.png'} className="h-32 object-cover" alt="" fill />
        </div>
        <div className="relative w-full h-[80vh] my-6">
          <Image src={'/images/sponsored/featured_result.png'} className="h-32 object-cover" alt="" fill />
        </div>

      </div>
    </div>
  );
}
