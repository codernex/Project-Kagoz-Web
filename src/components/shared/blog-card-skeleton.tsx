import React from "react";
import { Card, CardContent } from "../ui/card";

export default function BlogCardSkeleton() {
  return (
    <Card className="border-none rounded-smd !p-[1.2rem] animate-pulse">
      <CardContent className="p-0 space-y-[1.6rem]">
        {/* Image Placeholder */}
        <div className="w-full h-full min-h-[20rem] bg-gray-200 rounded-sm" />

        {/* Content Placeholder */}
        <div className="space-y-[1.2rem]">
          {/* Date + Icon Placeholder */}
          <div className="flex items-center space-x-[.8rem]">
            <div className="h-[1.4rem] w-[1.4rem] bg-gray-300 rounded-sm" />
            <div className="h-3 w-24 bg-gray-300 rounded" />
          </div>

          {/* Title Placeholder */}
          <div className="space-y-[.6rem]">
            <div className="h-5 w-3/4 bg-gray-300 rounded" />
            <div className="h-5 w-1/2 bg-gray-300 rounded" />
          </div>

          {/* Description Placeholder */}
          <div className="space-y-[.6rem]">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>

          {/* Read More Placeholder */}
          <div className="flex items-center space-x-[.8rem]">
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="h-4 w-4 bg-gray-300 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
