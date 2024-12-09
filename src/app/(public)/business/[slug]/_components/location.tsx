"use client"
import GoogleMapComponent from "@/components/map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetBusinessBySlugQuery } from "@/redux/api";
import { Clock } from "lucide-react";
import { useParams } from "next/navigation";

export const LocationAndHours = () => {
  const { slug } = useParams() as { slug: string }
  const { data } = useGetBusinessBySlugQuery(slug)
  if (!data?.openingHours) {
    return null
  }
  return (
    <div className="space-y-sm">
      <h2 className="text-mdx font-bold text-black">Location & Hours</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2xl">
        <div className="">
          {data?.openingHours.map((o, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "flex p-smd justify-between",
                  index % 2 === 0 && "bg-[#F7F7F7]",
                )}
              >
                <div className="flex items-center space-x-[1rem] font-medium">
                  <Clock
                    size={18}
                    className="text-muted fill-muted text-white"
                  />
                  <span className="text-black">{o.day}</span>
                </div>
                {
                  o.timeRanges.map(t => {

                    return (
                      <div key={t.id} className="text-black">
                        <p><span className="w-[8rem] inline-block">{t.fromHours}:{t.fromMinutes} {t.fromPeriod}</span> - <span className="w-[8rem] inline-block">{t.toHours}:{t.toMinutes} {t.toPeriod}</span></p>
                      </div>
                    )
                  })
                }
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-y-smd">
          <div className="rounded-smd overflow-hidden">
            <GoogleMapComponent />
          </div>
          <div className="flex justify-between items-center text-black">
            <h2 className="text-md font-semibold">Gulshan, Dhaka 1206</h2>
            <Button className="h-[4.5rem] px-[3.4rem]">Get Direction</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
