"use client";
import "leaflet/dist/leaflet.css";
import { Loader } from "lucide-react";

// Component to handle map centering dynamically



const Map: React.FC<{
  lat: number;
  lng: number;
  isLoading: boolean;
  cid:string
}> = ({ lat, lng, isLoading,cid }) => {
  return (
    <div className="w-full h-[40vh]">
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe
        width="600"
        height="450"
        frameborder="0"
        style="border:0"
        src="https://maps.google.com/maps?cid=${cid}&output=embed"
        allowfullscreen>
      </iframe>`
        }}
      />
    </div>
  );
};

export default Map;