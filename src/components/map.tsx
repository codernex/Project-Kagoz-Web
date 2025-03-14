"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Component to handle map centering dynamically

const markerIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [30, 40] as L.PointExpression,
});

const Map: React.FC<{
  lat: number;
  lng: number;
  isLoading: boolean;
  cid:string
}> = ({ lat, lng, isLoading,cid }) => {

  console.log(lat, lng)
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
      {/* <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          icon={markerIcon}
          position={[lat, lng]}

        >
          <Popup>
            <p>{"Unknown Dealer"}</p>
          </Popup>
        </Marker>
      </MapContainer> */}
      {/* Optional loading spinner */}

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.2)] z-[9999]">
          <Loader size={38} className="animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default Map;