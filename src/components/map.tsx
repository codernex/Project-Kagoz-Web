"use client";
"use client";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const origin = {
  lat: 37.437041393899676,
  lng: -4.191635586788259,
};

const destination = {
  lat: 37.440575591901045,
  lng: -4.231433159434073,
};

const GoogleMapComponent = () => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={10}>
        <Marker position={origin} />
        <Marker position={destination} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
