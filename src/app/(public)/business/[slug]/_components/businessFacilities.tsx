import { Calendar, CheckCircle2, XCircle } from "lucide-react";

export const BusinessFacilities = () => {
  return (
    <div className="space-y-sm">
      <h2 className="text-[2.4rem] font-bold text-black">
        Business Facilities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-slg">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-center space-x-sm">
              <CheckCircle2 size={20} className="text-green-500" />
              <div className="flex space-x-xxs text-black font-medium items-center">
                <Calendar size={20} />
                <p>Walk-ins Welcome</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-slg">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-center space-x-sm">
              <XCircle size={20} className="text-red-500" />
              <div className="flex space-x-xxs text-black font-medium items-center">
                <Calendar size={20} />
                <p>Walk-ins Welcome</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
