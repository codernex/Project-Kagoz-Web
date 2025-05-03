"use client"
import GoogleMapComponent from "@/components/map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetBusinessBySlugQuery } from "@/redux/api";
import { Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function LocationAndHours() {
  const { slug } = useParams() as { slug: string }
  const { data } = useGetBusinessBySlugQuery(slug)

  const openingHours = useMemo(() => {
    const object: Record<string, OpeningHour['timeRanges']> = {}
    data?.openingHours.map(o => {
      object[o.day] = o.timeRanges
    })
    return object
  }, [data?.openingHours])
  if (!openingHours || !data) {
    return null
  }

  return (
    <>
      <div className="space-y-sm">
        <h2 className="text-mdx font-bold text-black">Location & Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2xl gap-y-12">
          <div className="">
            {Object.entries(openingHours).map(([key, value], index) => {
              console.log(value)
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col lg:flex-row p-smd justify-between",
                    index % 2 === 0 && "bg-[#F7F7F7]",
                  )}
                >
                  <div className="flex items-center space-x-[1rem] font-medium">
                    <Clock
                      size={18}
                      className="text-muted fill-muted text-white"
                    />
                    <span className="text-black">{key}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    {
                      value.map(t => {

                        return (
                          <div key={t.id} className="text-black">
                            <p className="flex justify-between">
                              <span className="w-fit px-1 inline-block">{t.fromHours}:{t.fromMinutes} {t.fromPeriod}</span>
                              <span className="w-2">
                                -
                              </span>
                              <span className="w-fit px-1 inline-block">{t.toHours}:{t.toMinutes} {t.toPeriod}</span></p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-y-smd">
            <div className="rounded-smd overflow-hidden">
              <GoogleMapComponent cid={data.cid} isLoading={false} lat={data.latitude ? Number(data.latitude) : 0} lng={data.longitude ? Number(data.longitude) : 0} />
            </div>
            <div className="flex justify-between items-center text-black">
              <h2 className="text-md font-semibold">{data.streetAddress}</h2>
              <Button onClick={() => {
                window.open(`https://www.google.com/maps/dir/?cid=${data.cid}`, "_blank")
              }} className="h-[4.5rem] px-[3.4rem]">Get Direction</Button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#EEEDED]" />
    </>

  );
};
